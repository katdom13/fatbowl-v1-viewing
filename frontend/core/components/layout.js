import { useContext, useEffect, useState } from "react"
import Header from "./header"
import Head from 'next/head'
import { axiosInstance } from "../config/axios"
import AppContext from "../contexts/AppContext"

const DefaultLayout = props => {
  const [categories, setCategories] = useState(null)
  const {totalItemQty, setTotalItemQty} = useContext(AppContext)

  useEffect(() => {
    async function getCategories() {
      await axiosInstance.get('api/categories/')
      .then(data => setCategories(data.data))
      .catch(err => console.error(err))
    }

    getCategories()
  }, [])

  useEffect(() => {
    async function getTotalItemQty() {
      await axiosInstance.get('api/cart/')
        .then(response => setTotalItemQty(response.data.total_item_qty))
        .catch(err => console.error(err))
    }

    getTotalItemQty()
  }, [totalItemQty])

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Header categories={categories} totalItemQty={totalItemQty} />
      {props.children}
    </>
  )
}

export default DefaultLayout