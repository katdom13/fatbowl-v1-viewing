import { useContext, useEffect, useState } from "react"
import Header from "./header"
import Head from 'next/head'
import { getCategories } from "../config/axios"
import AppContext from "../contexts/AppContext"
import Footer from "./footer"

const DefaultLayout = props => {
  const [categories, setCategories] = useState(null)
  
  useEffect(() => {
    getCategories()
      .then(categories => setCategories(categories))
      .catch(err => console.error(err))
  }, [])

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Header categories={categories} />
      {props.children}
      <Footer />
    </>
  )
}

export default DefaultLayout