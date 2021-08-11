/* eslint-disable react/prop-types */
import React from "react"

import { Container, Box } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

import ProductGrid from "../components/productGrid"
import { getProducts } from "../config/axios"

export default function Home({ products }) {
  return (
    <>
      <Container component="div" maxWidth="lg">
        <Alert severity="info">
          COVID-19 - <u>Click here for our latest updates</u> on our stores, website
          and contact centre. Thank you for your patience and support.
        </Alert>
      </Container>
      <Box component="main" paddingY={4}>
        <ProductGrid category={"All"} products={products} />
      </Box>
    </>
  )
}

// eslint-disable-next-line no-unused-vars
export async function getStaticProps(context) {
  const products = await getProducts()
  return {
    props: {
      products: products,
    },
  }
}
