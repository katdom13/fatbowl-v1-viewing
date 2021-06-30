import '../styles/globals.css'
import DefaultLayout from '../components/layout'
import { useEffect, useState } from 'react'
import { CookiesProvider } from 'react-cookie'
import AppContext from '../contexts/AppContext'
import { getCartItemQty, whoami2 } from '../config/axios'
import Router from 'next/router'

function MyApp({ Component, pageProps }) {

  const initialAppData = Object.freeze({
    totalItemQty: 0,
    loggedIn: false,
  })

  const [appData, setAppData] = useState(initialAppData)

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    Router.events.on('routeChangeStart', () => {
      console.log('AAAAAAAAAAAA')
    })
    
    // initialize states
    initializeAppData()

  }, [])

  useEffect(() => {
    // re-initialize states
    initializeAppData()
  }, [appData.loggedIn])

  const initializeAppData = () => {
    whoami2()
      .then(response => {
        getCartItemQty()
          .then(response => {
            setAppData({
              ...appData,
              totalItemQty: response,
              loggedIn: true
            })
          })
          .catch(err => console.error(err))
      })
      .catch(err => {
        console.error('[WHOAMI ERROR]', err)
        setAppData({
          ...appData,
          totalItemQty: 0,
          loggedIn: err.response.status === 403 ? false : true
        })
      })
  }

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
