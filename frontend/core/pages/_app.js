import '../styles/globals.css'
import DefaultLayout from '../components/layout'
import { useEffect } from 'react'
import { CookiesProvider } from 'react-cookie'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <CookiesProvider>
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </CookiesProvider>
  )
}

export default MyApp
