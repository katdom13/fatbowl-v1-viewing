import React, { useContext, useState } from "react"
import { useEffect } from "react"
import AppContext from "../contexts/AppContext"
import Router from 'next/router'
import { useCookies } from "react-cookie"
import Login from '../pages/login'
import { whoami } from "../config/axios"

export default function withAuthentication(WrappedComponent) {
  return function (props) {
    const {context, state} = useContext(AppContext)
    const [cookies, setCookie] = useCookies(['sessionid'])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      if (Boolean(cookies.sessionid) === false) {
        Router.push(`/login?next=${Router.asPath}`, undefined, {shallow: true})
      } else {
        setLoading(false)
      }
    }, [])

    useEffect(() => {
      if (state.next && Boolean(cookies.sessionid) === false) {
        context.reload({...state, next: Router.asPath})
      }
    }, [state.next])

    return loading ? <Login /> : <WrappedComponent />
  }
}
