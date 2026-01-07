import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { doc, updateDoc, serverTimestamp, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/lib/firestore';

interface ExoBoosterStatus {
  charge: string;
  start_count: string;
  status: string;
  remains: string;
  currency: string;
}

// Map ExoBooster status to our internal status
const mapExoStatus = (exoStatus: string): Order['status'] => {
  const statusLower = exoStatus.toLowerCase();
  
  if (statusLower === 'completed') return 'completed';
  if (statusLower === 'partial') return 'completed';
  if (statusLower === 'canceled' || statusLower === 'cancelled') return 'cancelled';
  if (statusLower === 'refunded') return 'cancelled';
  if (statusLower === 'in progress' || statusLower === 'inprogress') return 'processing';
  if (statusLower === 'pending') return 'pending';
  if (statusLower === 'processing') return 'processing';
  
  // Default to processing for unknown statuses
  return 'processing';
};

// Calculate delivered count from ExoBooster response
const calculateDelivered = (startCount: string, remains: string, quantity: number): number => {
  const start = parseInt(startCount) || 0;
  const remaining = parseInt(remains) || 0;
  
  // If we have start count info, use it
  if (start > 0) {
    return Math.max(0, quantity - remaining);
  }
  
  // Otherwise estimate based on remains
  return Math.max(0, quantity - remaining);
};

export const syncOrderStatus = async (orderId: string, exoboosterOrderId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('exobooster', {
      body: { action: 'status', orderId: exoboosterOrderId }
    });

    if (error) {
      console.error('Error fetching ExoBooster status:', error);
      return false;
    }

    if (!data?.success || !data?.data) {
      console.error('Invalid ExoBooster response:', data);
      return false;
    }

    const exoStatus: ExoBoosterStatus = data.data;
    const newStatus = mapExoStatus(exoStatus.status);
    
    // Find and update the order in Firestore
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('exoboosterOrderId', '==', exoboosterOrderId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.error('Order not found in Firestore:', exoboosterOrderId);
      return false;
    }

    const orderDoc = snapshot.docs[0];
    const orderData = orderDoc.data() as Order;
    
    // Calculate delivered count
    const delivered = calculateDelivered(
      exoStatus.start_count, 
      exoStatus.remains, 
      orderData.quantity
    );

    // Update order in Firestore
    await updateDoc(doc(db, 'orders', orderDoc.id), {
      status: newStatus,
      delivered: delivered,
      updatedAt: serverTimestamp()
    });

    console.log(`Order ${exoboosterOrderId} synced: ${newStatus}, delivered: ${delivered}/${orderData.quantity}`);
    return true;
  } catch (error) {
    console.error('Error syncing order status:', error);
    return false;
  }
};

export const syncAllUserOrders = async (userId: string): Promise<number> => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef, 
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    
    let syncedCount = 0;
    const pendingOrProcessing = snapshot.docs.filter(doc => {
      const data = doc.data();
      return (data.status === 'pending' || data.status === 'processing') && data.exoboosterOrderId;
    });

    // Sync each order (with a small delay to avoid rate limiting)
    for (const orderDoc of pendingOrProcessing) {
      const data = orderDoc.data();
      const success = await syncOrderStatus(orderDoc.id, data.exoboosterOrderId);
      if (success) syncedCount++;
      // Small delay between API calls
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    return syncedCount;
  } catch (error) {
    console.error('Error syncing all orders:', error);
    return 0;
  }
};

export const useOrderSync = (userId: string | undefined, orders: Order[]) => {
  const syncingRef = useRef(false);
  const lastSyncRef = useRef<number>(0);
  
  const syncOrders = useCallback(async () => {
    if (!userId || syncingRef.current) return;
    
    // Debounce: don't sync more than once every 10 seconds
    const now = Date.now();
    if (now - lastSyncRef.current < 10000) return;
    
    syncingRef.current = true;
    lastSyncRef.current = now;
    
    try {
      const count = await syncAllUserOrders(userId);
      if (count > 0) {
        console.log(`Synced ${count} orders`);
      }
    } finally {
      syncingRef.current = false;
    }
  }, [userId]);

  // Auto-sync on mount and when orders change
  useEffect(() => {
    if (!userId) return;
    
    // Check if there are any pending/processing orders
    const hasActiveOrders = orders.some(o => 
      (o.status === 'pending' || o.status === 'processing') && o.exoboosterOrderId
    );
    
    if (hasActiveOrders) {
      syncOrders();
      
      // Also set up interval for continuous sync
      const interval = setInterval(syncOrders, 30000); // Sync every 30 seconds
      return () => clearInterval(interval);
    }
  }, [userId, orders, syncOrders]);

  return { syncOrders };
};
