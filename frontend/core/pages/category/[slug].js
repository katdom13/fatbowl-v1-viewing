import { Container, Typography, Box, Button, makeStyles, Grid, Card, CardMedia, CardContent } from '@material-ui/core'
import axios from 'axios'
import DefaultLayout from '../../components/layout'
import Link from 'next/link'

const Category = ({products}) => {
  const classes = useStyles()

  return (
    <DefaultLayout>
      <Box component='main' paddingTop={4}>
        <Container maxWidth="lg" className={classes.cardGrid}>
          <Grid container spacing={2}>
            {
              products && products.map(product => (
                <Link key={product.id} href={`/product/${encodeURIComponent(product.slug)}`}>
                    <Grid item xs={6} sm={4} md={3}>
                      <Card elevation={1}>
                        <CardMedia
                          className={classes.cardMedia}
                          image={product.product_image[0].image}
                          alt={product.product_image[0].alt_text}
                        />
                        <CardContent>
                          <Typography gutterBottom component="p">
                            { product.title }
                          </Typography>
                          <Box component="p" fontSize={16} fontWeight={900}>
                            ₱{ product.regular_price }
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                </Link>
              ))
            }
          </Grid>
        </Container>
      </Box>
    </DefaultLayout>
  )
}

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingBottom: theme.spacing(8),
  },
  cardMedia: {
    // paddingTop: theme.spacing(40)
    height: theme.spacing(40),
  },
  container: {
    textAlign: 'center',
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10)
  },
  header: {
    fontSize: 38,
    fontWeight: '100',
    // fontFamily: '"Nunito", sans-serif'
  },
  lead: {
    fontSize: 24,
    fontWeight: '100',
    // fontFamily: '"Nunito", sans-serif',
    color: theme.palette.grey[700],
    marginBottom: theme.spacing(2)
  }
}))

export async function getStaticProps(context) {
  const products = await axios.get(`http://localhost:8001/api/products/category/${context.params.slug}/`)

  return {
    props: {
      products: products.data,
    }
  }
}

export async function getStaticPaths() {
  return {
    paths: [{
      params: {
        slug: 'snack'
      }
    }],
    fallback: false
  }
}

export default Category