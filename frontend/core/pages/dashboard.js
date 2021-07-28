import { 
  Box,
  Container,
  Grid,
  makeStyles,
  Typography,
  Divider,
  Paper,
} from "@material-ui/core"
import Link from 'next/link'
import withAuthentication from "../components/withAuthentication"
import Head from 'next/head'
import LocalMallOutlinedIcon from '@material-ui/icons/LocalMallOutlined'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import LocalShippingOutlinedIcon from '@material-ui/icons/LocalShippingOutlined'

const Dashboard = () => {
  const classes = useStyles()

  return (
    <>
      <Head>
        <title>Your account</title>
      </Head>
      <Container maxWidth='lg'>
        <Grid container>
          <Grid item xs={12}>
            <Typography component='h1' variant='h4' gutterBottom>
              Your dashboard
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component='p' gutterBottom>
              Manage your <b>orders</b> and personal details
            </Typography>
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Link href='/'>
              <Paper variant='outlined' className={classes.paper}>
                <Box margin={1} style={{ height: '100%' }}>
                  <Grid container spacing={2} style={{ height: '100%' }}>
                    <Grid item xs={2} className={classes.iconGrid} >
                      <LocalMallOutlinedIcon fontSize='large'/>
                    </Grid>
                    <Grid item xs={10}>
                      <Typography variant='h5' component='h1' gutterBottom>
                        Orders
                      </Typography>
                      <Typography variant='body1' component='p' color='textSecondary'>
                        View, Track, Change or buy again
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Link href='/settings/profile'>
              <Paper variant='outlined' className={classes.paper}>
                <Box margin={1} style={{ height: '100%' }}>
                  <Grid container spacing={2} style={{ height: '100%' }}>
                    <Grid item xs={2} className={classes.iconGrid} >
                      <LockOutlinedIcon fontSize='large'/>
                    </Grid>
                    <Grid item xs={10}>
                      <Typography variant='h5' component='h1' gutterBottom>
                        Login & Security
                      </Typography>
                      <Typography variant='body1' component='p' color='textSecondary'>
                        Edit login, email and phone number
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Link href='/settings/addresses'>
              <Paper variant='outlined' className={classes.paper}>
                <Box margin={1} style={{ height: '100%' }}>
                  <Grid container spacing={2} style={{ height: '100%' }}>
                    <Grid item xs={2} className={classes.iconGrid} >
                      <LocalShippingOutlinedIcon fontSize='large'/>
                    </Grid>
                    <Grid item xs={10}>
                      <Typography variant='h5' component='h1' gutterBottom>
                        Your addresses
                      </Typography>
                      <Typography variant='body1' component='p' color='textSecondary'>
                        Edit your shipping addresses
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Link href='/account/wishlist'>
              <Paper variant='outlined' className={classes.paper}>
                <Box margin={1} style={{ height: '100%' }}>
                  <Grid container spacing={2} style={{ height: '100%' }}>
                    <Grid item xs={2} className={classes.iconGrid} >
                      <LocalShippingOutlinedIcon fontSize='large'/>
                    </Grid>
                    <Grid item xs={10}>
                      <Typography variant='h5' component='h1' gutterBottom>
                        Your wishlist
                      </Typography>
                      <Typography variant='body1' component='p' color='textSecondary'>
                        View and edit items in your wishlist
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  detailLink: {
    color: theme.palette.primary.main,
  },
  divider: {
    margin: theme.spacing(2, 0, 2, 0),
  },
  iconGrid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    height: '100%',
    cursor: 'pointer',
  }
}))

export default withAuthentication(Dashboard)