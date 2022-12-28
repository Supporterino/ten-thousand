import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import SocketManager from '@components/websocket/SocketManager';
import { useSetRecoilState } from 'recoil';
import SocketState from '@components/websocket/SocketState';
import { createContext } from 'react';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const socketManager = new SocketManager();
  const SocketManagerContext = createContext(socketManager);
  socketManager.setSocketState = useSetRecoilState(SocketState);

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'dark',
        }}
      >
        <NotificationsProvider position="bottom-center" limit={15}>
          <SocketManagerContext.Provider value={socketManager}>
            <Component {...pageProps} />
          </SocketManagerContext.Provider>
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
}
