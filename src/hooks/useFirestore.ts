import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { 
  Transaction, 
  Order,
  subscribeToTransactions, 
  subscribeToOrders,
  subscribeToUserBalance,
  rechargeWallet as rechargeWalletFn,
  createOrder as createOrderFn,
  cancelOrder as cancelOrderFn,
  ensureUserDocument
} from '@/lib/firestore';

export const useWallet = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [loyaltyLevel, setLoyaltyLevel] = useState('bronze');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBalance(0);
      setTransactions([]);
      setLoading(false);
      return;
    }

    let unsubBalance: (() => void) | null = null;
    let unsubTransactions: (() => void) | null = null;

    const init = async () => {
      setLoading(true);
      
      // Ensure user document exists first
      try {
        await ensureUserDocument(user.uid);
      } catch (error) {
        console.error('Error ensuring user document:', error);
      }

      // Subscribe to balance updates
      unsubBalance = subscribeToUserBalance(user.uid, (bal, points, level) => {
        setBalance(bal);
        setLoyaltyPoints(points);
        setLoyaltyLevel(level);
        setLoading(false);
      });

      // Subscribe to transactions (with error handling for missing index)
      try {
        unsubTransactions = subscribeToTransactions(user.uid, (txs) => {
          setTransactions(txs);
        });
      } catch (error) {
        console.error('Error subscribing to transactions:', error);
        setTransactions([]);
      }
    };

    init();

    return () => {
      if (unsubBalance) unsubBalance();
      if (unsubTransactions) unsubTransactions();
    };
  }, [user]);

  const recharge = useCallback(async (amount: number, method: string) => {
    if (!user) throw new Error('User not authenticated');
    const result = await rechargeWalletFn(user.uid, amount, method);
    return result;
  }, [user]);

  const refreshBalance = useCallback(async () => {
    if (!user) return;
    // Force re-subscribe to get fresh balance
    await ensureUserDocument(user.uid);
  }, [user]);

  return {
    balance,
    loyaltyPoints,
    loyaltyLevel,
    transactions,
    loading,
    recharge,
    refreshBalance
  };
};

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const unsubscribe = subscribeToOrders(user.uid, (ordersData) => {
        setOrders(ordersData);
        setLoading(false);
        setError(null);
      });

      return () => unsubscribe();
    } catch (err: any) {
      console.error('Error subscribing to orders:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [user]);

  const createOrder = async (orderData: Omit<Order, 'id' | 'userId' | 'delivered' | 'status' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');
    return createOrderFn(user.uid, orderData);
  };

  const cancelOrder = async (orderId: string) => {
    if (!user) throw new Error('User not authenticated');
    return cancelOrderFn(orderId, user.uid);
  };

  // Computed stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  return {
    orders,
    loading,
    stats,
    createOrder,
    cancelOrder
  };
};
