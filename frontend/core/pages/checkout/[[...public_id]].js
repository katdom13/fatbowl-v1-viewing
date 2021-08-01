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
  Menu,
  MenuItem,
  fade,
  Typography,
  Radio,
  Card,
  CardHeader,
  CardContent
} from "@material-ui/core"
import LocalShippingOutlinedIcon from '@material-ui/icons/LocalShippingOutlined'
import Head from "next/head"
import Link from 'next/link'
import { useEffect, useState } from "react"
import { getAddresses, getCart, getDeliveryOptions, updateAddress } from "../../config/axios"
import Router from 'next/router'
import { useCookies } from "react-cookie"
import Alert from '@material-ui/lab/Alert'

const Checkout = ({options}) => {
  const classes = useStyles()
  const [cookies, setCookie] = useCookies(['csrftoken'])

  const [header, setHeader] = useState('Delivery options')
  const [subheader, setSubheader] = useState('Select a delivery option')

  const [pageState, setPageState] = useState('options')
  const [alert, setAlert] = useState({
    severity: '',
    message: '',
  })

  // Delivery options
  const [deliveryOption, setDeliveryOption] = useState('')
  const [subtotal, setSubtotal] = useState('0.00')
  const [deliveryCost, setDeliveryCost] = useState('0.00')
  const [total, setTotal] = useState('0.00')

  // Addresses
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState({})

  useEffect(() => {
    let public_id = Object.entries(Router.query).length > 0 ? Router.query.public_id[0] : ''
    if (Boolean(public_id)) {
      getCart(public_id)
        .then(res => setSubtotal(res.total_price))
        .catch(err => console.error('[GET CART ERROR]', err && err.response ? err.response : err))
    }

    getAddresses()
      .then(res => {
        let selectedAddress = res.find(address => address.is_default)
        setAddresses(res)
        if (Object.entries(selectedAddress).length > 0) {
          setSelectedAddress(selectedAddress)
        }
      })
      .catch(err => console.error('[GET ADDRESSES ERROR]', err && err.response ? err.response : err))
  }, [])

  useEffect(() => {
    switch(pageState) {
      case 'options':
      case 'paypal':
        setHeader('Delivery options')
        setSubheader('Select a delivery option')
        break
      case 'addresses':
        setHeader('Delivery address')
        setSubheader('Select your delivery address')
    }
  }, [pageState])

  const handlePageState = () => {
    switch(pageState) {
      case 'options':
        if (!deliveryOption) {
          setAlert({
            severity: 'error',
            message: 'Please select delivery option',
          })
        } else {
          setPageState('addresses')
          setAlert({})
        }
        break
      case 'addresses':
        setPageState('paypal')
        break
    }
  }

  const handleChangeDeliveryOption = e => {
    let deliveryCost = options.find(option => option.id + '' === e.target.value).price
    setDeliveryOption(e.target.value)
    setDeliveryCost(deliveryCost)
    setTotal((parseFloat(deliveryCost) + parseFloat(subtotal)).toFixed(2))
  }

  const handleSelect = public_id => {
    let old = addresses.find(address => address.is_default === true)
    
    if (Boolean(old)) {
      updateAddress(old.public_id, {is_default: false}, cookies.csrftoken)
        .then(res => res)
        .catch(err => console.error('[UPDATE ADDRESS ERROR]', err && err.response ? err.response : err))
    }

    updateAddress(public_id, {is_default: true}, cookies.csrftoken)
      .then(res => {
        getAddresses()
          .then(res => {
            let selectedAddress = res.find(address => address.is_default)
            setAddresses(res)
            if (Object.entries(selectedAddress).length > 0) {
              setSelectedAddress(selectedAddress)
            }
          })
          .catch(err => console.error('[GET ADDRESSES ERROR]', err && err.response ? err.response : err))

        Router.push('')
      })
      .catch(err => console.error('[UPDATE ADDRESS ERROR]', err && err.response ? err.response : err))
  }

  return(
    <>
      <Head>
        <title>Checkout</title>
      </Head>
      <Container maxWidth='lg'>
        <Grid container>
          <Grid item xs={12}>
            <Typography component='h1' variant='h4' gutterBottom>
              {header}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component='p' gutterBottom>
              {subheader}
            </Typography>
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
      </Container>
      <Container maxWidth='lg'>
        {
          alert && alert.message ? (
            <Box width='100%' marginBottom={2}>
              <Alert severity={alert.severity}>
                {alert.message}
              </Alert>
            </Box>
          ) : null
        }
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {
              pageState === 'options' ? (
                <DeliveryOptions options={options} deliveryOption={deliveryOption} handleChangeDeliveryOption={handleChangeDeliveryOption} />
              ) : null
            }
            {
              pageState === 'addresses' ? (
                <DeliveryAddresses
                  addresses={addresses}
                  setAddresses={setAddresses}
                  selectedAddress={selectedAddress}
                  setSelectedAddress={setSelectedAddress}
                  handleSelect={handleSelect} />
              ) : null
            }

          </Grid>
          <Grid item xs={12} md={4}>
            <Box display='flex' alignItems='center' padding={1}>
              <Box flexGrow={1}>
                <Typography variant='body1' component='p'>
                  Sub total:
                </Typography>
              </Box>
              <Typography variant='h6' component='p'>
                <b>₱{subtotal}</b>
              </Typography>
            </Box>
            <Box display='flex' alignItems='center' padding={1}>
              <Box flexGrow={1}>
                <Typography variant='body1' component='p'>
                  Delivery cost:
                </Typography>
              </Box>
              <Typography variant='h6' component='p'>
                <b>₱{deliveryCost}</b>
              </Typography>
            </Box>
            <Divider />
            <Box display='flex' alignItems='center' padding={1}>
              <Box flexGrow={1}>
                <Typography variant='body1' component='p'>
                  <b>Total:</b>
                </Typography>
              </Box>
              <Typography variant='h6' component='p'>
                <b>₱{total}</b>
              </Typography>
            </Box>
            <Box marginTop={1}>
              <Button variant='contained' fullWidth color='primary'
                onClick={handlePageState}
              >
                Pay securely
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  )

}

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    padding: theme.spacing(1, 2),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  divider: {
    margin: theme.spacing(2, 0, 2, 0),
  },
  iconGrid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      alignItems: 'unset',
      justifyContent: 'unset',
    }
  },
}))

const DeliveryOptions = ({options, deliveryOption, handleChangeDeliveryOption}) => {
  const classes = useStyles()

  return (
    <Grid container spacing={2}>
      {
        options.map(option => (
            <Grid item xs={12} key={option.id} >
              <Paper variant='outlined'>
                <Box padding={2}>
                  <Grid container>
                    <Grid item xs={2} className={classes.iconGrid}>
                      <LocalShippingOutlinedIcon fontSize='large' />
                    </Grid>

                    <Grid item xs={9}>
                      <Typography variant='h5' component='h1' gutterBottom>
                        {option.name}
                      </Typography>
                      <Typography variant='body1' component='p' color='textSecondary'>
                        Your order should be delivered within {option.timeframe.toLowerCase()}
                      </Typography>
                    </Grid>

                    <Grid item xs={1}>
                      <Radio
                        color='primary'
                        checked={deliveryOption === option.id + ''}
                        onChange={handleChangeDeliveryOption}
                        value={option.id + ''}
                      />
                    </Grid>

                  </Grid>
                </Box>
              </Paper>
            </Grid>
          ))
      }
    </Grid>
  )
}

const DeliveryAddresses = ({addresses, selectedAddress, handleSelect}) => {
  const classes = useStyles()

  return (
    <Grid container spacing={2}>
      {
        !Boolean(addresses.length) ? (
          <Grid item xs={12}>
            <Box display='flex' alignItems='center' gridGap={8}>
              <Typography component='p'>
                There are no delivery addresses set,
              </Typography> 
              <Link href='/account/address' passHref>
                <ALink>
                  add address
                </ALink>
              </Link>
            </Box>
          </Grid>
        ) : null
      }
      {
        Object.entries(selectedAddress).length > 0 ? (
          <Grid item xs={12}>
            <Card variant='outlined' style={{height: '100%'}}>
              <CardHeader
                title={
                  <Typography variant='body1' color='textSecondary'>
                    Selected
                  </Typography>  
                }
                classes={{
                  root: classes.cardHeader,
                }}
              />
              <CardContent>
                <Typography variant='body1'>
                  {selectedAddress.address_line_1}
                </Typography>
                <Typography variant='body1'>
                  {selectedAddress.address_line_2}
                </Typography>
                <Typography variant='body1'>
                  {selectedAddress.town_city}
                </Typography>
                <Typography variant='body1'>
                  {selectedAddress.postcode}
                </Typography>
                <Typography variant='body1'>
                  {selectedAddress.phone_number}
                </Typography>
                <Box paddingTop={4} display='flex' gridGap={3}>
                  <Link href={`/account/address/${selectedAddress.public_id}`} passHref>
                    <ALink>
                      Edit
                    </ALink>
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ) : null
      }
      {
        addresses.length ? (
          <Grid item xs={12}>
            <Box marginTop={2}>
              <Typography variant='h6' component='h1'>
                Other addresses
              </Typography>
            </Box>
          </Grid>
        ) : null
      }
      {
        addresses.filter(address => !address.is_default)
          .map((address, index) => (
          <Grid item xs={12}>
            <Card variant='outlined' style={{height: '100%'}}>
              <CardHeader
                title={
                  <Box padding={1} />
                }
                classes={{
                  root: classes.cardHeader,
                }}
              />
              <CardContent>
                <Typography variant='body1' gutterBottom>
                  <b>Address {index + 1}</b>
                </Typography>
                <Typography variant='body1'>
                  {address.address_line_1}
                </Typography>
                <Typography variant='body1'>
                  {address.address_line_2}
                </Typography>
                <Typography variant='body1'>
                  {address.town_city}
                </Typography>
                <Typography variant='body1'>
                  {address.postcode}
                </Typography>
                <Typography variant='body1'>
                  {address.phone_number}
                </Typography>
                <Box paddingTop={4} display='flex' gridGap={3}>
                  <Link href={`/account/address/${address.public_id}`} passHref>
                    <ALink>
                      Edit
                    </ALink>
                  </Link>
                  {
                    !address.is_default ? (
                      <>
                        |
                        <ALink onClick={() => handleSelect(address.public_id)}>
                          Select
                        </ALink>
                      </>
                    ) : null
                  }
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))
      }
    </Grid>
  )
}

export async function getServerSideProps(context) {
  const options = await getDeliveryOptions()
  const addresses = await getAddresses()
  return {
    props: {
      options,
      addresses,
    }
  }
}

export default Checkout