/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useState } from "react"
import { useEffect } from "react"

import Router from "next/router"
import { useCookies } from "react-cookie"

import AppContext from "../contexts/AppContext"
import Login from "../pages/login"

export default function withAuthentication(WrappedComponent) {
  return function bootstrapFunc() {
    const { context, state } = useContext(AppContext)
    const [cookies] = useCookies(["sessionid"])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      if (Boolean(cookies.sessionid) === false) {
        Router.push(`/login?next=${Router.asPath}`, undefined, { shallow: true })
      } else {
        setLoading(false)
      }
    }, [])

    useEffect(() => {
      if (state.next && Boolean(cookies.sessionid) === false) {
        context.reload({ ...state, next: Router.asPath })
      }
    }, [state.next])

    return loading ? <Login /> : <WrappedComponent />
  }
}
