import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { WS_BASE_URL } from '@/lib/constants';
import { toast } from 'sonner';

interface UseWebSocketOptions {
  receiptId?: string;
  onProgress?: (data: any) => void;
  onComplete?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useWebSocket = ({ receiptId, onProgress, onComplete, onError }: UseWebSocketOptions) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  const connect = useCallback(() => {
    if (!receiptId || socketRef.current) return;

    console.log(`🔌 Connecting to WebSocket: ${WS_BASE_URL}/receipts`);

    const socket = io(`${WS_BASE_URL}/receipts`, {
      transports: ['websocket', 'polling'],
      path: '/socket.io/',
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socket.on('connect', () => {
      console.log('✅ WebSocket connected:', socket.id);
      setIsConnected(true);
      setReconnectAttempt(0);
      
      // Subscribe to receipt updates
      socket.emit('subscribe', receiptId);
      console.log(`📡 Subscribed to receipt: ${receiptId}`);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error.message);
      setIsConnected(false);
      setReconnectAttempt(prev => prev + 1);
      
      if (reconnectAttempt >= 3) {
        toast.error('Connection lost. Retrying...', { duration: 2000 });
      }
    });

    socket.on('progress', (data) => {
      console.log('📊 Progress update:', data);
      onProgress?.(data);
    });

    socket.on('complete', (data) => {
      console.log('✅ Analysis complete:', data);
      onComplete?.(data);
    });

    socket.on('error', (errorData) => {
      console.error('❌ WebSocket error:', errorData);
      onError?.(errorData);
      toast.error(`Analysis failed: ${errorData.error}`, { duration: 5000 });
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 WebSocket disconnected:', reason);
      setIsConnected(false);
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect manually
        socket.connect();
      }
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
      toast.success('Connection restored!', { duration: 2000 });
    });

    socketRef.current = socket;
  }, [receiptId, onProgress, onComplete, onError, reconnectAttempt]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log('🔌 Disconnecting WebSocket');
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { 
    connect, 
    disconnect, 
    isConnected,
    socket: socketRef.current 
  };
};
