import {
  Container,
  Grid,
  Box,
  Paper,
  makeStyles,
  Typography,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  Table,
  fade,
  InputLabel,
  FormControl,
  Button,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Divider
} from "@material-ui/core"
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { useState, useEffect, useContext } from "react"
import Head from 'next/head'
import { addCartItem, getProduct, getProducts, whoami } from "../../config/axios"
import { useCookies } from 'react-cookie'
import AppContext from "../../contexts/AppContext"
import Image from 'next/image'
import Router from 'next/router'

const Product = ({product}) => {
  const classes = useStyles()

  const [qty, setQty] = useState(1)
  const [cookies, setCookie] = useCookies(['csrftoken'])
  const {context: {reload}, state} = useContext(AppContext)

  const handleAdd = () => {
    if (state.loggedIn === false) {
      reload({...state, next: Router.asPath})
    } else {
      let body = {
        product_id: product.id,
        product_qty: qty
      }
  
      addCartItem(body, cookies.csrftoken)
        .then(response => {
          console.log('[ADD TO CART]', response.item)
          reload({...state, qty: response.total_item_qty})
        })
        .catch(err => console.error('[ADD TO CART ERROR]', err.response.data))
    }
  }

  return (
    <>
      <Head>
        <title>{product.title}</title>
      </Head>
      <Container maxWidth='md'>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>

            <Grid container>
              <Grid item xs={12}>
                <Typography variant='h3' component='h1' className={classes.title}>
                  {product.title}
                </Typography>
                <Typography variant='body1' component='p' color='textSecondary' gutterBottom>
                  {product.description}
                </Typography>

                <Box display='flex' justifyContent='center' paddingTop={2}>
                  <Image
                    src={product.product_image[0].image}
                    alt={product.product_image[0].alt_text}
                    width={400}
                    height={400}
                  />
                </Box>
              </Grid>
            </Grid>

          </Grid>

          <Grid item xs={12} md={5}>
            <Box component='div' display='grid' gridGap={`0.5rem`}>
              <Box component='div' display='flex' justifyContent='space-between'>
                <Box component='div'>
                  <Typography variant='h4' component='p' style={{ fontWeight: 400 }}>
                    ₱{ product.regular_price }
                  </Typography>
                  <Typography variant='body1' component='p' color='textSecondary' style={{ fontWeight: 400 }}>
                    includes tax
                  </Typography>
                </Box>

                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor='qty' classes={{
                    root: classes.label
                  }}>Qty</InputLabel>
                  <OutlinedInput
                    classes={{
                      root: classes.qty,
                      input: classes.qtyInput,
                    }}
                    id='qty'
                    type='number'
                    value={qty}
                    onChange={e => setQty(e.target.value)}
                    startAdornment={
                      <InputAdornment position='start'>
                        <IconButton
                          onClick={() => qty === 0 ? setQty(0) : setQty(qty - 1)}
                          size='small'
                          color={qty === 0 ? 'default' : 'primary'}
                        >
                          <RemoveCircleIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          onClick={() => setQty(qty + 1)}
                          size='small'
                          color='primary'
                        >
                          <AddCircleIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Box>

              <Divider variant='middle' component='hr' style={{margin: '16px'}} />

              <Button variant="contained" color="primary" onClick={handleAdd}>
                Add to Cart
              </Button>

              <Button variant="contained" color="default">
                Add to favorites
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  cardMedia: {
    height: theme.spacing(40),
    [theme.breakpoints.up('sm')]: {
      height: theme.spacing(60),
    }
  },
  formControl: {
    maxWidth: 150,
  },
  label: {
    margin: theme.spacing(0.5, 0, 0, 1)
  },
  qty: {
    padding: theme.spacing(1, 0.5, 0, 0.5),
  },
  qtyInput: {
    padding: theme.spacing(2, 0, 2, 0),
  },
  select: {
    padding: theme.spacing(1),
  },
  tableCell: {
    borderBottom: `1px solid ${fade(theme.palette.common.black, 0.1)}`,
  },
  tableContainer: {
    marginTop: theme.spacing(2),
    // border: '1px solid rgba(224, 224, 224, 1)'
    border: `1px solid ${fade(theme.palette.common.black, 0.1)}`,
    overflowX: 'hidden'
  },
  title: {
    fontWeight: 100,
  },
}))

export async function getStaticProps(context) {
  const product = await getProduct(context.params.slug)

  return {
    props: {
      product: product,
    },
  }
}

export async function getStaticPaths() {
  const products = await getProducts()
  
  const paths = products.map(product => ({
    params: {
      slug: product.slug
    }
  }))

  return {
    paths: paths,
    fallback: false
  }
}

export default Product