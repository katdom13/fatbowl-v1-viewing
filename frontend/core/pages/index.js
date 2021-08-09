import {
  Container,
  Typography,
  Box,
  Button,
  makeStyles,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import Link from 'next/link'
import { useContext, useEffect } from 'react'
import { getProducts, whoami } from '../config/axios'
import AppContext from '../contexts/AppContext'
import { useCookies } from 'react-cookie'
import ProductGrid from '../components/productGrid'

export default function Home({products}) {
  const classes = useStyles()
  const [cookies, setCookie] = useCookies(['csrftoken'])

  return (
    <>
      <Container component='div' maxWidth='lg'>
        <Alert severity="info">
          COVID-19 - <u>Click here for our latest updates</u> on our stores, website and contact centre. Thank you for your patience and support.
        </Alert>
      </Container>
      <Box component='main' paddingY={4}>
        <ProductGrid category={`All`} products={products} />
      </Box>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
}))

export async function getStaticProps(context) {
  const products = await getProducts()
  return {
    props: {
      products: products,
    }
  }
}