import React from "react"

import { ListItem } from "@material-ui/core"
import { Typography } from "@material-ui/core"
import {
  Box,
  Container,
  Divider,
  Grid,
  makeStyles,
  Avatar,
  List,
} from "@material-ui/core"
import Link from "next/link"

const Footer = () => {
  const classes = useStyles()

  return (
    <Container component="footer" className={classes.container} maxWidth="lg">
      <Divider variant="middle" className={classes.divider} />

      <Box paddingTop={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm>
            <Avatar src="/logo.png" className={classes.logo} />

            <Typography component="small" color="textPrimary" variant="caption">
              &copy; 2017-2021
            </Typography>
          </Grid>

          <Grid item xs={6} sm>
            <Typography component="h5" variant="h6" gutterBottom>
              Features
            </Typography>

            <List className={classes.list}>
              <ListItem className={classes.listItem}>
                <Link href="/">
                  <a className={classes.link}>Cool stuff</a>
                </Link>
              </ListItem>

              <ListItem className={classes.listItem}>
                <Link href="/">
                  <a className={classes.link}>Random feature</a>
                </Link>
              </ListItem>

              <ListItem className={classes.listItem}>
                <Link href="/">
                  <a className={classes.link}>Team feature</a>
                </Link>
              </ListItem>

              <ListItem className={classes.listItem}>
                <Link href="/">
                  <a className={classes.link}>Stuff for developers</a>
                </Link>
              </ListItem>

              <ListItem className={classes.listItem}>
                <Link href="/">
                  <a className={classes.link}>Another one</a>
                </Link>
              </ListItem>

              <ListItem className={classes.listItem}>
                <Link href="/">
                  <a className={classes.link}>Last time</a>
                </Link>
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={6} sm>
            <Typography component="h5" variant="h6" gutterBottom>
              Resources
            </Typography>

            <List className={classes.list}>
              <ListItem className={classes.listItem}>
                <Link href="/">
                  <a className={classes.link}>Resource name</a>
                </Link>
              </ListItem>

              <ListItem className={classes.listItem}>
                <Link href="/">
                  <a className={classes.link}>Resource</a>
                </Link>
              </ListItem>

              <ListItem className={classes.listItem}>
                <Link href="/">
                  <a className={classes.link}>Another resource</a>
                </Link>
              </ListItem>

              <ListItem className={classes.listItem}>
                <Link href="/">
                  <a className={classes.link}>Final Resource</a>
                </Link>
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={6} sm>
            <Typography component="h5" variant="h6" gutterBottom>
              Resources
            </Typography>

            <List className={classes.list}>
              <ListItem className={classes.listItem}>
                <Link href="/">
                  <a className={classes.link}>Business</a>
                </Link>
              </ListItem>

              <ListItem className={classes.listItem}>
                <Link href="/">
                  <a className={classes.link}>Education</a>
                </Link>
              </ListItem>

              <ListItem className={classes.listItem}>
                <Link href="/">
                  <a className={classes.link}>Government</a>
                </Link>
              </ListItem>

              <ListItem className={classes.listItem}>
                <Link href="/">
                  <a className={classes.link}>Gaming</a>
                </Link>
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={6} sm>
            <Typography component="h5" variant="h6" gutterBottom>
              About
            </Typography>

            <List className={classes.list}>
              <ListItem className={classes.listItem}>
                <Link href="/">
                  <a className={classes.link}>Team</a>
                </Link>
              </ListItem>

              <ListItem className={classes.listItem}>
                <Link href="/">
                  <a className={classes.link}>Locations</a>
                </Link>
              </ListItem>

              <ListItem className={classes.listItem}>
                <Link href="/">
                  <a className={classes.link}>Privacy</a>
                </Link>
              </ListItem>

              <ListItem className={classes.listItem}>
                <Link href="/">
                  <a className={classes.link}>Terms</a>
                </Link>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(6),

    paddingBottom: theme.spacing(6),
  },

  divider: {
    margin: theme.spacing(2, 0, 2, 0),
  },

  link: {
    color: theme.palette.text.secondary,

    textDecoration: "none",
  },

  list: {
    padding: 0,

    margin: 0,
  },

  listItem: {
    padding: theme.spacing(0, 0, 1, 0),

    margin: 0,
  },

  logo: {
    width: theme.spacing(4),

    height: theme.spacing(4),
  },
}))

export default Footer
