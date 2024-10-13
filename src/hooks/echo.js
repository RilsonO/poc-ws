import { useEffect, useState } from 'react';
// import axios from "axios";
import { api as axios } from '../services/api';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js/react-native';

const useEcho = () => {
  const [echoInstance, setEchoInstance] = useState(null);

  useEffect(() => {
    //  Setup Pusher client
    // const PusherClient = new Pusher('o3j4m5x97f00s1clgnce', {
    //   wsHost: 'http://192.168.1.8',
    //   wsPort: 80,
    //   wssPort: 80,
    //   forceTLS: 'http',
    //   enabledTransports: ['ws', 'wss'],
    //   disableStats: true,
    //   cluster: 'mt1',
    //   authorizer: (channel, options) => {
    //     return {
    //       authorize: (socketId, callback) => {
    //         axios
    //           .post('/broadcasting/auth', {
    //             socket_id: socketId,
    //             channel_name: channel.name,
    //           })
    //           .then((response) => {
    //             callback(false, response.data);
    //           })
    //           .catch((error) => {
    //             callback(true, error);
    //           });
    //       },
    //     };
    //   },
    // });

    // // Create Echo instance
    // const echo = new Echo({
    //   broadcaster: 'reverb',
    //   client: PusherClient,
    // });

    console.log('Initialising Echo...');

    const echo = new Echo({
      broadcaster: 'reverb',
      key: 'o3j4m5x97f00s1clgnce',
      wsHost: 'http://192.168.1.8',
      wsPort: 80,
      wssPort: 80,
      forceTLS: 'http',
      enabledTransports: ['ws', 'wss'],
      authorizer: (channel, options) => {
        return {
          authorize: (socketId, callback) => {
            axios
              .post('/broadcasting/auth', {
                socket_id: socketId,
                channel_name: channel.name,
              })
              .then((response) => {
                callback(false, response.data);
              })
              .catch((error) => {
                callback(true, error);
              });
          },
        };
      },
      Pusher,
    });
    // Listen for successful connection
    echo.connector.pusher.connection.bind('connected', () => {
      console.log('Successfully connected to Echo server.');
    });

    // Listen for connection errors
    echo.connector.pusher.connection.bind('error', (error: any) => {
      console.error('Error connecting to Echo server:', error);
    });

    console.log('Subscribing to channel...');
    echo
      .private('channel_for_everyone')
      .listen('CommentCreatedEvent', (event: any) => {
        console.log('Event received:', event);
      });
    setEchoInstance(echo);

    // Cleanup on unmount
    return () => {
      if (echo) {
        echo.disconnect();
      }
    };
  }, []);

  return echoInstance;
};

export default useEcho;
