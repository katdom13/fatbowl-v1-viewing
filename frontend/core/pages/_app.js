import '../styles/globals.css'
import DefaultLayout from '../components/layout'
import { useEffect, useState } from 'react'
import { CookiesProvider } from 'react-cookie'
import AppContext from '../contexts/AppContext'
import { getCartItemQty } from '../config/axios'

function MyApp({ Component, pageProps }) {

  const initialAppData = Object.freeze({
    totalItemQty: 0,
    loggedIn: false
  })

  const [appData, setAppData] = useState(initialAppData)
  
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    if (appData.loggedIn) {
      getCartItemQty()
        .then(response => setAppData({...appData, totalItemQty: response}))
        .catch(err => console.error(err))
    } else {
      setAppData({...appData, totalItemQty: 0})
    }
  }, [appData.loggedIn])

  return (
    <AppContext.Provider value={{appData, setAppData}}>
      <CookiesProvider>
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </CookiesProvider>
    </AppContext.Provider>
  )
}

export default MyApp
