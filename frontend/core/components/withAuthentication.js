/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useState } from "react"
import { useEffect } from "react"

import Router from "next/router"

import AppContext from "../contexts/AppContext"
import Login from "../pages/login"
import customCookies from "./customCookies"

export default function withAuthentication(WrappedComponent) {
  return function bootstrapFunc() {
    const { context, state } = useContext(AppContext)
    const cookies = customCookies
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      if (Boolean(cookies.get("access_token")) === false) {
        Router.push(`/login?next=${Router.asPath}`, undefined, { shallow: true })
      } else {
        setLoading(false)
      }
    }, [])

    useEffect(() => {
      if (state.next && Boolean(cookies.get("access_token")) === false) {
        context.reload({ ...state, next: Router.asPath })
      }
    }, [state.next])

    return loading ? <Login /> : <WrappedComponent />
  }
}
