import { Container, Typography, Box, Button, makeStyles, Grid, Card, CardMedia, CardContent } from '@material-ui/core'
import axios from 'axios'
import DefaultLayout from '../components/layout'
import Link from 'next/link'

export default function Home({products}) {
  const classes = useStyles()

  return (
    <DefaultLayout>
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
  },
  lead: {
    fontSize: 24,
    fontWeight: '100',
    color: theme.palette.grey[700],
    marginBottom: theme.spacing(2)
  }
}))

export async function getStaticProps(context) {
  const products = await axios.get('http://127.0.0.1:8001/api/products/')

  return {
    props: {
      products: products.data,
    }
  }
}