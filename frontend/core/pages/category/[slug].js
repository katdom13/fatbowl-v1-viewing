import { Box, makeStyles, } from '@material-ui/core'
import ProductGrid from '../../components/productGrid'
import axios from 'axios'
import Head from 'next/head'

const Category = ({category, products}) => {
  return (
    <>
      <Head>
        <title>{category}</title>
      </Head>
      <Box component='main' paddingTop={4}>
        <ProductGrid category={category} products={products} />
      </Box>
    </>
  )
}

export async function getStaticProps(context) {
  const results = await axios.get(`http://localhost:8001/api/products/category/${context.params.slug}/`)

  return {
    props: {
      category: results.data.category,
      products: results.data.products,
    }
  }
}

export async function getStaticPaths() {
  const categories = await axios.get('http://localhost:8001/api/categories/')

  const paths = categories.data.map(category => ({
    params: {
      slug: category.slug
    }
  }))

  return {
    paths: paths,
    fallback: false
  }
}

export default Category