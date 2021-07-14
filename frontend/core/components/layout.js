import { useContext, useEffect, useState } from "react"
import Header from "./header"
import Head from 'next/head'
import { getCategories } from "../config/axios"
import AppContext from "../contexts/AppContext"
import Footer from "./footer"
import {
  Box,
} from '@material-ui/core'

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
        <Box component='main' paddingTop={4}>
          {props.children}
        </Box>
      <Footer />
    </>
  )
}

export default DefaultLayout