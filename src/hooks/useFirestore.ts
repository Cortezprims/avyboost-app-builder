import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { 
  Transaction, 
  Order,
  subscribeToTransactions, 
  subscribeToOrders,
  subscribeToUserBalance,
  rechargeWallet as rechargeWalletFn,
  createOrder as createOrderFn,
  cancelOrder as cancelOrderFn
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

    setLoading(true);

    // Subscribe to balance updates
    const unsubBalance = subscribeToUserBalance(user.uid, (bal, points, level) => {
      setBalance(bal);
      setLoyaltyPoints(points);
      setLoyaltyLevel(level);
    });

    // Subscribe to transactions
    const unsubTransactions = subscribeToTransactions(user.uid, (txs) => {
      setTransactions(txs);
      setLoading(false);
    });

    return () => {
      unsubBalance();
      unsubTransactions();
    };
  }, [user]);

  const recharge = async (amount: number, method: string) => {
    if (!user) throw new Error('User not authenticated');
    return rechargeWalletFn(user.uid, amount, method);
  };

  return {
    balance,
    loyaltyPoints,
    loyaltyLevel,
    transactions,
    loading,
    recharge
  };
};

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = subscribeToOrders(user.uid, (ordersData) => {
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
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
