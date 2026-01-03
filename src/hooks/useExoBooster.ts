import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ExoBoosterService {
  service: string;
  name: string;
  type: string;
  category: string;
  rate: string;
  min: string;
  max: string;
}

export interface OrderResponse {
  order: string;
  charge?: string;
  start_count?: string;
  currency?: string;
}

export interface OrderStatus {
  order: string;
  status: string;
  charge?: string;
  start_count?: string;
  remains?: string;
  currency?: string;
}

export interface BalanceResponse {
  balance: string;
  currency: string;
}

export function useExoBooster() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callExoBooster = async <T>(data: Record<string, unknown>): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: result, error: fnError } = await supabase.functions.invoke('exobooster', {
        body: data,
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data as T;
    } catch (err: any) {
      const errorMessage = err.message || "Une erreur est survenue";
      setError(errorMessage);
      console.error("ExoBooster error:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get available services from ExoBooster
  const getServices = async (): Promise<ExoBoosterService[] | null> => {
    return callExoBooster<ExoBoosterService[]>({ action: 'services' });
  };

  // Create a new order
  const createOrder = async (
    serviceId: string,
    link: string,
    quantity: number
  ): Promise<OrderResponse | null> => {
    return callExoBooster<OrderResponse>({
      action: 'add',
      service: serviceId,
      link,
      quantity,
    });
  };

  // Check order status
  const getOrderStatus = async (orderId: string): Promise<OrderStatus | null> => {
    return callExoBooster<OrderStatus>({
      action: 'status',
      orderId,
    });
  };

  // Get account balance
  const getBalance = async (): Promise<BalanceResponse | null> => {
    return callExoBooster<BalanceResponse>({ action: 'balance' });
  };

  return {
    isLoading,
    error,
    getServices,
    createOrder,
    getOrderStatus,
    getBalance,
  };
}
