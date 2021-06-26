import { Container, Typography, Box, Button, makeStyles, Grid, Card, CardMedia, CardContent } from '@material-ui/core'
import Link from 'next/link'
import { useContext, useEffect } from 'react'
import { axiosInstance, whoami } from '../config/axios'
import AppContext from '../contexts/AppContext'
import { useCookies } from 'react-cookie'
import ProductGrid from '../components/productGrid'

export default function Home({products, totalItemQty}) {
  const classes = useStyles()
  const [cookies, setCookie] = useCookies(['csrftoken'])

  useEffect(() => {
    whoami()
  }, [])

  return (
    <>
      <Container component='section' className={classes.container} maxWidth='sm'>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant='h3' component='h1' gutterBottom className={classes.header}>
              Album example
            </Typography>
            <Typography variant='body1' component='p' gutterBottom className={classes.lead}>
              Something short and leading about the collection below—its contents, the creator,
              etc. Make it short and sweet, but not too short so folks don’t simply skip over it entirely.
            </Typography>
            <Button variant="contained" color="primary">
              Make an account
            </Button>
          </Grid>
        </Grid>
      </Container>
      <Box component='main'>
        <ProductGrid category={`All`} products={products} />
      </Box>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(3)
  },
  header: {
    fontSize: 38,
    fontWeight: '100',
  },
  lead: {
    fontSize: 24,
    fontWeight: '100',
    color: theme.palette.grey[700],
    marginBottom: theme.spacing(2)
  },
}))

export async function getStaticProps(context) {
  const products = await axiosInstance.get('api/products/')
  return {
    props: {
      products: products.data,
    }
  }
}