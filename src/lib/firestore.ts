import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp,
  increment,
  runTransaction,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';

// Types
export interface Transaction {
  id?: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  method?: string; // For credits: Orange Money, MTN, etc.
  service?: string; // For debits: service name
  orderId?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Timestamp;
}

export interface Order {
  id?: string;
  userId: string;
  service: string;
  platform: string;
  quantity: number;
  delivered: number;
  targetUrl: string;
  amount: number;
  deliveryType: 'standard' | 'express';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  estimatedTime: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Wallet Functions
export const rechargeWallet = async (
  userId: string, 
  amount: number, 
  method: string
): Promise<string> => {
  // Create transaction
  const transactionRef = await addDoc(collection(db, 'transactions'), {
    userId,
    type: 'credit',
    amount,
    method,
    status: 'pending',
    createdAt: serverTimestamp()
  });

  // In a real app, you would integrate with payment provider here
  // For now, we'll simulate success after a short delay
  
  // Update transaction and user balance atomically
  await runTransaction(db, async (transaction) => {
    const userRef = doc(db, 'users', userId);
    const userDoc = await transaction.get(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const currentBalance = userDoc.data().balance || 0;
    
    transaction.update(userRef, {
      balance: currentBalance + amount
    });
    
    transaction.update(transactionRef, {
      status: 'completed'
    });
  });

  return transactionRef.id;
};

export const debitWallet = async (
  userId: string, 
  amount: number, 
  service: string,
  orderId: string
): Promise<boolean> => {
  return await runTransaction(db, async (transaction) => {
    const userRef = doc(db, 'users', userId);
    const userDoc = await transaction.get(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const currentBalance = userDoc.data().balance || 0;
    
    if (currentBalance < amount) {
      throw new Error('Insufficient balance');
    }

    // Debit balance
    transaction.update(userRef, {
      balance: currentBalance - amount
    });

    // Create debit transaction
    const transactionRef = doc(collection(db, 'transactions'));
    transaction.set(transactionRef, {
      userId,
      type: 'debit',
      amount,
      service,
      orderId,
      status: 'completed',
      createdAt: serverTimestamp()
    });

    return true;
  });
};

// Get user transactions with real-time updates
export const subscribeToTransactions = (
  userId: string,
  callback: (transactions: Transaction[]) => void
) => {
  const q = query(
    collection(db, 'transactions'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const transactions: Transaction[] = [];
    snapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() } as Transaction);
    });
    callback(transactions);
  });
};

// Order Functions
export const createOrder = async (
  userId: string,
  orderData: Omit<Order, 'id' | 'userId' | 'delivered' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  // Check balance first
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new Error('User not found');
  }

  const currentBalance = userDoc.data().balance || 0;
  
  if (currentBalance < orderData.amount) {
    throw new Error('Solde insuffisant. Veuillez recharger votre portefeuille.');
  }

  // Create order
  const orderRef = await addDoc(collection(db, 'orders'), {
    userId,
    ...orderData,
    delivered: 0,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  // Debit wallet
  await debitWallet(userId, orderData.amount, orderData.service, orderRef.id);

  // Add loyalty points (1 point per 100 XAF spent)
  const pointsEarned = Math.floor(orderData.amount / 100);
  await updateDoc(userRef, {
    loyaltyPoints: increment(pointsEarned)
  });

  return orderRef.id;
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order['status'],
  delivered?: number
) => {
  const orderRef = doc(db, 'orders', orderId);
  const updates: Partial<Order> = {
    status,
    updatedAt: serverTimestamp() as Timestamp
  };
  
  if (delivered !== undefined) {
    updates.delivered = delivered;
  }
  
  await updateDoc(orderRef, updates);
};

export const cancelOrder = async (orderId: string, userId: string) => {
  return await runTransaction(db, async (transaction) => {
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await transaction.get(orderRef);
    
    if (!orderDoc.exists()) {
      throw new Error('Order not found');
    }

    const order = orderDoc.data() as Order;
    
    if (order.status !== 'pending') {
      throw new Error('Seules les commandes en attente peuvent être annulées');
    }

    // Refund to wallet
    const userRef = doc(db, 'users', userId);
    const userDoc = await transaction.get(userRef);
    const currentBalance = userDoc.data()?.balance || 0;

    transaction.update(userRef, {
      balance: currentBalance + order.amount
    });

    // Update order status
    transaction.update(orderRef, {
      status: 'cancelled',
      updatedAt: serverTimestamp()
    });

    // Create refund transaction
    const transactionRef = doc(collection(db, 'transactions'));
    transaction.set(transactionRef, {
      userId,
      type: 'credit',
      amount: order.amount,
      method: 'Remboursement',
      orderId,
      status: 'completed',
      createdAt: serverTimestamp()
    });

    return true;
  });
};

// Get user orders with real-time updates
export const subscribeToOrders = (
  userId: string,
  callback: (orders: Order[]) => void
) => {
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const orders: Order[] = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    callback(orders);
  });
};

// Get user balance with real-time updates
export const subscribeToUserBalance = (
  userId: string,
  callback: (balance: number, loyaltyPoints: number, loyaltyLevel: string) => void
) => {
  const userRef = doc(db, 'users', userId);
  
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      callback(
        data.balance || 0, 
        data.loyaltyPoints || 0, 
        data.loyaltyLevel || 'bronze'
      );
    }
  });
};
