// components/context/socketcontext.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './authContext';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [authState] = useContext(AuthContext);
  const { user, token } = authState;
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let socketInstance;

    const initializeSocket = () => {
      if (token && user && user.id && user.isDriver) {
        console.log('Initializing socket connection');
        socketInstance = io('http://**************', {
          query: { token },
          transports: ['websocket'],
        });

        socketInstance.on('connect', () => {
          console.log('Connected to Socket.IO server with ID:', socketInstance.id);
          console.log('Registering driver on socket connect:', user.id);
          socketInstance.emit('registerDriver', { driverId: user.id });
        });

        socketInstance.on('disconnect', () => {
          console.log('Socket disconnected');
        });

        socketInstance.on('connect_error', (error) => {
          console.error('Connection Error:', error);
        });

        setSocket(socketInstance);
      } else {
        console.log('Not initializing socket: User is not logged in or not a driver');
      }
    };

    const disconnectSocket = () => {
      if (socketInstance) {
        console.log('Disconnecting socket');
        socketInstance.disconnect();
        socketInstance = null;
        setSocket(null);
      }
    };

    if (user && token && user.isDriver) {
      initializeSocket();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [user, token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
