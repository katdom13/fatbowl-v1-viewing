import React, { useContext } from "react"
import { useEffect } from "react"
import AppContext from "../contexts/AppContext"
import Router from 'next/router'
import { useCookies } from "react-cookie"
import Login from '../pages/login'

export default function withAuthentication(WrappedComponent) {
  return function (props) {
    const {context, state} = useContext(AppContext)
    const [cookies, setCookie] = useCookies(['sessionid'])

    useEffect(() => {
      if (Boolean(cookies.sessionid) === false) {
        Router.push(`/login?next=${Router.asPath}`, undefined, {shallow: true})
      }
    }, [])

    useEffect(() => {
      if (Boolean(cookies.sessionid) === false) {
        context.reload({...state, next: Router.asPath})
      }
    }, [state.next])

    // return Boolean(cookies.sessionid) ? <WrappedComponent /> : <Login />
    return <WrappedComponent />
  }
}
