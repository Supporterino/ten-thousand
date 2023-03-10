import '../styles/globals.css';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { SocketManagerProvider } from '@components/websocket/SocketManagerProvider';
import { RecoilRoot } from 'recoil';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <RecoilRoot>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: 'dark',
          }}
        >
          <NotificationsProvider position="top-center" limit={15}>
            <SocketManagerProvider>
              <Component {...pageProps} />
            </SocketManagerProvider>
          </NotificationsProvider>
        </MantineProvider>
      </RecoilRoot>
    </>
  );
}
