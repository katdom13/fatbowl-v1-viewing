import { 
  Box,
  Container,
  Grid,
  makeStyles,
  Typography,
  Divider
} from "@material-ui/core"
import Link from 'next/link'
import withAuthentication from "../components/withAuthentication"
import Head from 'next/head'

const Dashboard = () => {
  const classes = useStyles()

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Box component='main' paddingTop={6}>
        <Container maxWidth='md'>
          <Grid container>
            <Grid item xs={12}>
              <Typography component='h1' variant='h4' gutterBottom>
                Your dashboard
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box display='flex' justifyContent='space-between'>
                <Typography component='p' gutterBottom>
                  Manage your <b>orders</b> and personal detail
                </Typography>
                <Link href='/'>
                  <a className={classes.detailLink}>
                    Change details
                  </a>
                </Link>
              </Box>
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
        </Container>
      </Box>
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
}))

export default withAuthentication(Dashboard)