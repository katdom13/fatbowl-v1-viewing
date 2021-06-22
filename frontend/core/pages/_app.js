import '../styles/globals.css'
import DefaultLayout from '../components/layout'
import { useEffect, useState } from 'react'
import { CookiesProvider } from 'react-cookie'
import AppContext from '../contexts/AppContext'

function MyApp({ Component, pageProps }) {

  const [totalItemQty, setTotalItemQty] = useState(0)

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <AppContext.Provider value={{totalItemQty, setTotalItemQty}}>
      <CookiesProvider>
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </CookiesProvider>
    </AppContext.Provider>
  )
}

export default MyApp
