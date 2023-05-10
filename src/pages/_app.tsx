import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import Head from 'next/head'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Authorized } from '@/components/Authorized'

const theme = extendTheme({
  fonts: {
    heading: `'Noto Sans JP', sans-serif`,
    body: `'Noto Sans JP', sans-serif`,
  },
  styles: {
    global: {
      body: {
        backgroundColor: '#f1f1f1',
      },
      html: {
        height: '100%',
      },
    },
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  return (
    <>
      <Head>
        <meta
          name='viewport'
          content='width=device-width,initial-scale=1,viewport-fit=cover'
        />
        <meta
          name='format-detection'
          data-hid='format-detection'
          content='telephone=no,address=no,email=no'
        />
      </Head>
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          {router.pathname == '/' && (
            <>
              <Component {...pageProps} />
            </>
          )}
          {router.pathname !== '/' && (
            <>
              <Authorized>
                <Component {...pageProps} />
              </Authorized>
            </>
          )}
        </ChakraProvider>
      </RecoilRoot>
    </>
  )
}

export default MyApp
