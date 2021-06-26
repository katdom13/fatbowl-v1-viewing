import {
  Box,
  Container,
  Grid,
  Link as ALink,
  Paper,
  Divider,
  InputLabel,
  FormControl,
  Button,
  OutlinedInput,
  InputAdornment,
  IconButton,
  makeStyles,
} from "@material-ui/core"
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import CreateIcon from '@material-ui/icons/Create'
import ClearIcon from '@material-ui/icons/Clear'
import { useContext, useEffect, useState } from "react"
import { axiosInstance, whoami } from "../config/axios"
import { useCookies } from 'react-cookie'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import PageTitle from "../components/pageTitle"
import { Hidden } from "@material-ui/core"
import AppContext from "../contexts/AppContext"
import { Typography } from "@material-ui/core"

const Cart = () => {
  const classes = useStyles()
  const [cookies, setCookie] = useCookies(['csrftoken'])

  const [items, setItems] = useState([])
  const [qtys, setQtys] = useState({})
  const [price, setPrice] = useState(0)

  const {totalItemQty, setTotalItemQty} = useContext(AppContext)

  useEffect(() => {
    async function getItems() {
      await axiosInstance.get('api/cart/')
        .then(response => {
          setItems(response.data.items)
          setTotalItemQty(response.data.total_item_qty)
          setPrice(response.data.total_item_price)
        })
        .catch(err => console.log('[CART ERROR]', err.response))
    }
    whoami()
    getItems()
  }, [])

  // assign multiple quantities for every cart item
  // so it can be edited by the text field onChange function
  useEffect(() => {
    if (items) {
      var dict = {}
      items.map(item => dict[item.id] = item.qty)
      setQtys(dict)
    }
  }, [items])

  const handleDelete = id => {
    async function deleteItem(id) {
      await axiosInstance.delete(`api/cart/${encodeURIComponent(id)}/`, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': cookies.csrftoken,
        }
      })
        .then(response => {
          console.log('[DELETED ITEM]', response.data.item)
          setItems(response.data.items)
          setTotalItemQty(response.data.total_item_qty)
          setPrice(response.data.total_item_price)
        })
        .catch(err => console.log('[CART ERROR]', err.response))
    }

    deleteItem(id)
  }

  const handleUpdate = (id) => {
    let qty = qtys[id]

    async function updateItem(id) {
      var item = items.find(item => item.id === id)
      await axiosInstance.put(`api/cart/${encodeURIComponent(id)}/`,
        {
          'product': item.product,
          'qty': qtys[id],
        },
        {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': 'YeNRPzeDCKrO43g94LzovEdYDZ9HdNzs1LmkT8v4MYRC6opa8ZMlBmIcp1rZBmBB',
        }
      })
        .then(response => {
          console.log('[UPDATED ITEM]', response.data.item)
          setItems(response.data.items)
          setTotalItemQty(response.data.total_item_qty)
          setPrice(response.data.total_item_price)
        })
        .catch(err => console.log('[CART ERROR]', err.response))
    }
    
    if (qty === 0) {
      handleDelete(id)
    } else {
      updateItem(id)
    }

  }

  return (
    <>
      <Head>
        <title>Cart Summary</title>
      </Head>
      <Box paddingTop={5}>
        <Container maxWidth='lg'>
          <PageTitle component='h1' variant='h5'>
            Your shopping cart
          </PageTitle>
          {
            items && items.map(item => (
              <Paper variant='outlined' square key={item.id} className={classes.card}>
                <Grid container>
                  <Grid item xs={4} md={5} lg={4} className={classes.img}>
                    <Image
                      src={item.product_detail.product_image[0].image}
                      alt={item.product_detail.product_image[0].alt_text}
                      width={300}
                      height={300}
                    />
                  </Grid>
                  <Grid item xs={8} md={7} lg={8} className={classes.detail}>
                    <Box
                      display='flex'
                      flexDirection='row'
                      alignItems='center'
                      justifyContent='space-between'
                      className={classes.titleBox}
                    >
                      <Link href={`/product/${encodeURIComponent(item.product_detail.slug)}`} passHref>
                        <ALink component='h1' variant='h5' className={classes.title}>
                          {item.product_detail.title}
                        </ALink>
                      </Link>
                    </Box>
                    <Paper variant='outlined' square>
                      <Box className={classes.description}>
                        {/* <Hidden xsDown> */}
                          <Box marginBottom={2}>
                            <Grid container>
                              <Grid item sm={8}>
                                {item.product_detail.description}
                              </Grid>
                              <Grid item xs={12} sm={4} className={classes.price}>
                                ₱{item.product_detail.regular_price}
                              </Grid>
                            </Grid>
                          </Box>
                          <Divider/>
                        {/* </Hidden> */}
                        <Box className={classes.buttonGroup}>
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
                              value={qtys[item.id]}
                              onChange={e => {
                                e.target.value <= 0 ? setQtys({...qtys, [item.id]: 0}) : setQtys({...qtys, [item.id]: e.target.value})
                              }}
                              startAdornment={
                                <InputAdornment position='start'>
                                  <IconButton
                                    onClick={() => qtys[item.id] <= 0 ? setQtys({...qtys, [item.id]: 0}) : setQtys({...qtys, [item.id]: qtys[item.id] - 1})}
                                    size='small'
                                    color={qtys[item.id] <= 0 ? 'default' : 'primary'}
                                  >
                                    <RemoveCircleIcon />
                                  </IconButton>
                                </InputAdornment>
                              }
                              endAdornment={
                                <InputAdornment position='end'>
                                  <IconButton
                                    onClick={() => setQtys({...qtys, [item.id]: qtys[item.id] + 1})}
                                    size='small'
                                    color='primary'
                                  >
                                    <AddCircleIcon />
                                  </IconButton>
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                          
                          <Box display='flex'>
                            <Hidden xsDown>
                              <Button
                                variant='outlined'
                                size='small'
                                color='primary'
                                startIcon={<CreateIcon />}
                                className={classes.button}
                                onClick={() => handleUpdate(item.id)}
                              >
                                Update
                              </Button>

                              <Button
                                variant='outlined'
                                size='small'
                                color='default'
                                startIcon={<ClearIcon />}
                                className={classes.button}
                                onClick={() => handleDelete(item.id)}
                              >
                                Delete
                              </Button>
                            </Hidden>
                            <Hidden smUp>
                              <Button variant='outlined' size='small' color='primary' className={classes.button} onClick={() => handleUpdate(item.id)}>
                                <CreateIcon />
                              </Button>

                              <Button variant='outlined' size='small' color='default' className={classes.button} onClick={() => handleDelete(item.id)}>
                                <ClearIcon />
                              </Button>
                            </Hidden>
                          </Box>          
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            ))
          }
          <Grid container>
            <Grid item xs={12}>
              <Box paddingY={2}>
                <Typography component='h6' className={classes.price}>
                  Sub total: ₱{price}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(2),
      flexDirection: 'row',
    },
  },
  card: {
    margin: theme.spacing(2, 0, 2, 0),
  },
  description: {
    padding: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(2),
    },
  },
  detail: {
    padding: theme.spacing(0, 1, 0, 1),
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(0, 2, 0, 2),
    },
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(1),
    },
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
  img: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      '& img': {
        width: '80px !important',
        height: '80px !important',
        minWidth: 'unset !important',
        maxWidth: 'unset !important',
        minHeight: 'unset !important',
        maxHeight: 'unset !important',
      },
    },
  },
  price: {
    textAlign: 'end',
    fontWeight: 'bold',
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(1, 0, 1, 0),
      fontSize: 16
    }
  },
  title: {
    textDecoration: 'none',
    color: 'inherit',
    fontWeight: 'bold',
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'none',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 18
    }
  },
  titleBox: {
    padding: theme.spacing(1, 0, 1, 0),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2, 0, 2, 0)
    }
  }
}))

// export async function getStaticProps(context) {
//   const response = await axiosInstance.get('api/cart/')
//   return {
//     props: {
//       items: response.data.items,
//       qty: response.data.total_item_qty,
//       price: response.data.total_item_price,
//     }
//   }
// }

export default Cart