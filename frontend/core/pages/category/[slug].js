/* eslint-disable react/prop-types */
import React from "react"

import Head from "next/head"

import ProductGrid from "../../components/productGrid"
import { getCategories, getProducts } from "../../config/axios"

const Category = ({ category, products }) => {
  return (
    <>
      <Head>
        <title>{category}</title>
      </Head>

      <ProductGrid category={category} products={products} />
    </>
  )
}

export async function getStaticProps(context) {
  const response = await getProducts(context.params.slug)

  return {
    props: {
      category: response.category,
      products: response.products,
    },
  }
}

export async function getStaticPaths() {
  const categories = await getCategories()

  const paths = categories.map((category) => ({
    params: {
      slug: category.slug,
    },
  }))

  return {
    paths: paths,
    fallback: false,
  }
}

export default Category
