import { useContext, useEffect, useState } from "react"
import Header from "./header"
import Head from 'next/head'
import { getCartItemQty, getCategories } from "../config/axios"
import AppContext from "../contexts/AppContext"
import Footer from "./footer"

const DefaultLayout = props => {
  const [categories, setCategories] = useState(null)
  const { appData, setAppData } = useContext(AppContext)

  useEffect(() => {
    getCategories()
      .then(categories => setCategories(categories))
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    getCartItemQty()
      .then(response => setAppData({...appData, totalItemQty: response}))
      .catch(err => console.error(err))  
  }, [appData.totalItemQty])

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Header categories={categories} totalItemQty={appData.totalItemQty} />
      {props.children}
      <Footer />
    </>
  )
}

export default DefaultLayout