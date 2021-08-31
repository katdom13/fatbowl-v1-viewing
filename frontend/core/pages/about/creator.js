import React from "react"

import { Avatar, Box, Container, Grid, Typography } from "@material-ui/core"
import LinkedInIcon from "@material-ui/icons/LinkedIn"
import MailOutlineIcon from "@material-ui/icons/MailOutline"
import PhoneAndroidIcon from "@material-ui/icons/PhoneAndroid"
import { makeStyles } from "@material-ui/styles"
import Head from "next/head"

const Creator = () => {
  const classes = useStyles()

  return (
    <>
      <Head>
        <title>About the creator</title>
      </Head>
      <Container maxWidth="md">
        <Box>
          <Grid container>
            <Grid item xs={12} md={4}>
              <Box display="flex" justifyContent="center">
                <Avatar src="/creator.jpg" className={classes.picture} />
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box
                display="flex"
                flexDirection="column"
                paddingBottom={2}
                className={classes.header}
              >
                <Typography component="h1" variant="h4">
                  Katherine A. Domingo
                </Typography>
                <Typography component="p" variant="subtitle1" color="textSecondary">
                  Software engineer
                </Typography>
              </Box>
              <Box>
                <Typography component="h2" variant="h6">
                  Contact info
                </Typography>
                <Box
                  className={classes.content}
                  display="flex"
                  flexDirection="column"
                  gridGap={4}
                >
                  <Box display="flex" alignItems="center" gridGap={8}>
                    <LinkedInIcon fontSize="medium" />
                    linkedin.com/in/katherine-domingo-ab4747156
                  </Box>
                  <Box display="flex" alignItems="center" gridGap={8}>
                    <MailOutlineIcon fontSize="medium" />
                    katdom13@gmail.com
                  </Box>
                  <Box display="flex" alignItems="center" gridGap={8}>
                    <PhoneAndroidIcon font="medium" />
                    +639174167279
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box className={classes.section}>
          <Typography component="h2" variant="h6">
            About
          </Typography>
          <Box className={classes.content}>
            <Typography component="p" variant="body1">
              Software engineer with 4 years of experience in the IT industry who is
              passionate about creating, improving and automating any system. Skilled
              in web development and DevOps, Python using Django rest framework,
              React using Next JS framework, deployment using the AWS platform,
              containerization using Docker, and provisioning using Ansible.
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  content: {
    paddingTop: theme.spacing(1),
  },
  header: {
    [theme.breakpoints.down("sm")]: {
      paddingTop: theme.spacing(2),
      alignItems: "center",
    },
  },
  picture: {
    width: theme.spacing(30),
    height: theme.spacing(30),
  },
  section: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}))

export default Creator
