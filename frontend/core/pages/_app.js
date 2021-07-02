import '../styles/globals.css'
import DefaultLayout from '../components/layout'
import { useEffect, useMemo, useReducer, useState } from 'react'
import { CookiesProvider } from 'react-cookie'
import AppContext from '../contexts/AppContext'
import { getCartItemQty } from '../config/axios'
import Router from 'next/router'
import { useCookies } from 'react-cookie'

function MyApp({ Component, pageProps }) {

  const [cookies, setCookie] = useCookies(['sessionid'])

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'LOGIN':
          return {
            ...prevState,
            loggedIn: true,
            totalItemQty: action.qty
          }
        case 'LOGOUT':
          return {
            ...prevState,
            loggedIn: false,
            totalItemQty: 0,
          }
        case 'RELOAD':
          return {
            ...prevState,
            loggedIn: action.loggedIn,
            totalItemQty: action.qty,
            next: action.next
          }
      }
    },
    {
      loggedIn: Boolean(cookies.sessionid),
      totalItemQty: 0,
      next: ''
    },
  )

  const context = useMemo(() => ({
    login: async data => dispatch({
      type: 'LOGIN',
      qty: data.qty
    }),
    logout: async () => dispatch({
      type: 'LOGOUT'
    }),
    reload: async data => dispatch({
      type: 'RELOAD',
      qty: data.qty,
      loggedIn: data.loggedIn,
      next: data.next
    })
  }))

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    
    // initialize states
    initializeAppData()
  }, [])

  useEffect(() => {
    // re-initialize states
    initializeAppData()
  }, [state.loggedIn])

  const initializeAppData = () => {
    if (cookies.sessionid) {
      getCartItemQty()
        .then(response => context.reload({
          qty: response, loggedIn: true
        }))
        .catch(err => console.error(err))
    } else {
      context.reload({
        qty: 0, loggedIn: false
      })
    }
  }

  return (
    <AppContext.Provider value={{context, state}}>
      <CookiesProvider>
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </CookiesProvider>
    </AppContext.Provider>
  )
}

export default MyApp
