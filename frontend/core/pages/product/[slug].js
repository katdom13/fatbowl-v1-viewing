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
  IconButton
} from "@material-ui/core"
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { useState, useEffect, useContext } from "react"
import Head from 'next/head'
import { axiosInstance, whoami } from "../../config/axios"
import { useCookies } from 'react-cookie'
import AppContext from "../../contexts/AppContext"
import Image from 'next/image'

const Product = ({product}) => {
  const classes = useStyles()

  const [qty, setQty] = useState(1)
  const [cookies, setCookie] = useCookies(['csrftoken'])
  const {totalItemQty, setTotalItemQty} = useContext(AppContext)

  useEffect(() => {
    whoami()
  }, [])

  const handleAdd = () => {
    let csrfCookie = cookies.csrftoken

    async function addToCart(csrf) {
      await axiosInstance.post('api/cart/',
        {
          product_id: product.id,
          product_qty: qty
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf
          }
        }
      )
        .then(response => {
          console.log('[ADD TO CART]', response.data)
          setTotalItemQty(response.data.total_item_qty)
        })
        .catch(err => console.error('[ADD TO CART ERROR]', err.response.data))
    }

    addToCart(csrfCookie)
  }

  return (
    <>
      <Head>
        <title>{product.title}</title>
      </Head>
      <Container maxWidth='md'>
        <Box component='main' pt={5}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <Box display='flex' justifyContent='center'>
                <Image
                  src={product.product_image[0].image}
                  alt={product.product_image[0].alt_text}
                  width={400}
                  height={400}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Box my={1}>
                <Typography variant='h4' component='h1' className={classes.title}>
                  {product.title}
                </Typography>
              </Box>
              <Box component='p'>
                {product.description}
              </Box>
              <TableContainer component={Paper} elevation={0} className={classes.tableContainer}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className={classes.tableCell}>
                        <Box component='p' fontWeight={700}>
                          Price
                        </Box>
                      </TableCell>
                      <TableCell className={classes.tableCell} align='right'>
                        <Typography variant='h4' component='p' style={{ fontWeight: 700 }}>
                          ₱{ product.regular_price }
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.tableCell}>
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
                      </TableCell>
                      <TableCell className={classes.tableCell} align='right'>
                        <Button variant="contained" color="primary" onClick={handleAdd}>
                          Add to Cart
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Box>
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
    maxWidth: 200,
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
  const product = await axiosInstance.get(`http://localhost:8001/api/products/${context.params.slug}/`)

  return {
    props: {
      product: product.data,
    },
  }
}

export async function getStaticPaths() {
  const products = await axiosInstance.get('http://localhost:8001/api/products/')

  const paths = products.data.map(product => ({
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