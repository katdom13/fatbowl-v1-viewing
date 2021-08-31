/* eslint-disable react/prop-types */
import React, { useState } from "react"

import {
  Accordion,
  AccordionDetails as MaterialAccordionDetails,
  AccordionSummary as MaterialAccordionSummary,
  Box,
  Card,
  Container,
  makeStyles,
  Typography,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  withStyles,
  IconButton,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import clsx from "clsx"
import Head from "next/head"
import styled from "styled-components"

import ParallaxImage from "../../components/parallaxImage"
import faqs from "../../config/faq"
import { images, steps } from "../../config/howData"

const Fatbowl = () => {
  const classes = useStyles()

  const [activeStep, setActiveStep] = useState(0)
  const [expanded, setExpanded] = useState("none")

  const handleFAQ = (faq) => (event, newFaq) => {
    setExpanded(newFaq ? faq : false)
  }

  return (
    <>
      <Head>
        <title>About Fatbowl</title>
      </Head>
      <Box>
        <ParallaxImage image="/1.jpg" height="350px" darken>
          <Container maxWidth="md">
            <Box
              display="flex"
              flexDirection="column"
              textAlign="center"
              justifyContent="center"
            >
              <Typography
                component="h1"
                variant="h4"
                gutterBottom
                style={{ fontWeight: "bold" }}
              >
                About us
              </Typography>
              <Typography
                component="p"
                variant="body1"
                style={{ fontWeight: "bold" }}
              >
                Fatbowl aims to provide you with the most comforting food experience
                with home-cooked meals and delicatessen meticulously prepared and
                delivered to your door.
              </Typography>
            </Box>
          </Container>
        </ParallaxImage>
      </Box>
      <Box className={classes.servicesContainer}>
        <Typography component="h2" variant="h5" className={classes.sectionHeader}>
          Our services
        </Typography>
        <Box className={classes.servicesWrapper}>
          <Card className={classes.serviceCard}>
            <ServiceIcon src="/breakfast.svg" />
            <Typography component="p" variant="h6" gutterBottom>
              Fresh Products
            </Typography>
            <Typography component="p" variant="body1">
              We prepare some of the freshest products from local ingredients across
              Metro Manila.
            </Typography>
          </Card>
          <Card className={classes.serviceCard}>
            <ServiceIcon src="/support.svg" />
            <Typography component="p" variant="h6" gutterBottom>
              Support Local
            </Typography>
            <Typography component="p" variant="body1">
              By offering the freshest products using local ingredients, he help
              promote small, local food purveyors.
            </Typography>
          </Card>
          <Card className={classes.serviceCard}>
            <ServiceIcon src="/delivery.svg" />
            <Typography component="p" variant="h6" gutterBottom>
              Delivery to your place
            </Typography>
            <Typography component="p" variant="body1">
              Upon ordering, we will prepare your delicacies and our delivery
              personnel will go to your designated address with your items.
            </Typography>
          </Card>
        </Box>
      </Box>
      <Box className={classes.howContainer}>
        <Box className={classes.howWrapper}>
          <Typography
            component="h2"
            variant="h5"
            color="secondary"
            className={classes.sectionHeader}
            style={{
              textAlign: "center",
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
          >
            How it works
          </Typography>
          <Box className={classes.row}>
            <Box className={classes.col1}>
              <Box className={classes.howImgWrapper}>
                <HowImg src={images[activeStep].img} alt={images[activeStep].alt} />
              </Box>
            </Box>
            <Box className={classes.col2}>
              <Box className={classes.stepperWrapper}>
                <Stepper
                  activeStep={activeStep}
                  connector={<CustomConnector />}
                  orientation="vertical"
                >
                  {steps.map((label, idx) => (
                    <Step
                      key={label}
                      style={{ cursor: "pointer" }}
                      onClick={() => setActiveStep(idx)}
                    >
                      <StepLabel
                        StepIconComponent={CustomStepIconComponent}
                        StepIconProps={{ disabled: activeStep < idx }}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="center">
        <Box className={classes.faqWrapper}>
          <Typography
            component="h2"
            variant="h5"
            color="secondary"
            className={classes.sectionHeader}
          >
            FAQs
          </Typography>
          {faqs.map((faq) => (
            <Accordion
              key={`faq${faq.id}`}
              square
              expanded={expanded === `faq${faq.id}`}
              onChange={handleFAQ(`faq${faq.id}`)}
              elevation={0}
            >
              <AccordionSummary
                aria-controls={`faq${faq.id}-content`}
                id={`faq${faq.id}-header`}
                expandIcon={<ExpandMoreIcon />}
              >
                <Question variant="body1">{faq.q}</Question>
              </AccordionSummary>
              <AccordionDetails>
                <Answer variant="h6">{faq.a}</Answer>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  col1: {
    marginBottom: theme.spacing(2),
    padding: `0 ${theme.spacing(2)}px`,
    gridArea: "col1",
  },
  col2: {
    marginBottom: theme.spacing(2),
    padding: `0 ${theme.spacing(2)}px`,
    gridArea: "col2",
  },
  faqWrapper: {
    margin: "0 auto",
    padding: theme.spacing(8),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(4),
    },
    [theme.breakpoints.down("xs")]: {
      padding: `${theme.spacing(4)}px 0`,
    },
  },
  howContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    [theme.breakpoints.down("md")]: {
      padding: "100px 0",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "80px 0",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "12px 0 0 0",
    },
  },
  howImgWrapper: {
    maxWidth: 350,
    height: 250,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: "0 auto",

    [theme.breakpoints.down("xs")]: {
      alignItems: "flex-start",
    },
  },
  howWrapper: {
    display: "flex",
    flexDirection: "column",
    zIndex: 1,
    height: 680,
    margin: "0 auto",
    padding: `0 ${theme.spacing(3)}px`,
    justifyContent: "center",
    alignItems: "center",

    [theme.breakpoints.down("sm")]: {
      height: 800,
    },
  },
  row: {
    display: "grid",
    gridAutoColumns: "minmax(auto 1fr)",
    alignItems: "center",
    gridTemplateAreas: "'col1 col2'",

    [theme.breakpoints.down("sm")]: {
      gridTemplateAreas: "'col2' 'col1'",
    },
  },
  sectionHeader: {
    marginBottom: theme.spacing(4),
    fontWeight: "bold",
    textAlign: "center",
  },
  serviceCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: 300,
    padding: 30,
    borderRadius: "1em",
    textAlign: "center",
    "&:hover": {
      cursor: "pointer",
    },
  },
  servicesContainer: {
    height: 680,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#010606",
    color: "white",

    [theme.breakpoints.down("md")]: {
      height: 1000,
    },

    [theme.breakpoints.down("sm")]: {
      height: 1300,
    },
  },
  servicesWrapper: {
    display: "grid",
    alignItems: "center",
    gridTemplateColumns: "1fr 1fr 1fr",
    gridGap: theme.spacing(2),
    padding: "0 50px",

    [theme.breakpoints.down("md")]: {
      gridTemplateColumns: "1fr 1fr",
    },
    [theme.breakpoints.down("xs")]: {
      gridTemplateColumns: "1fr",
      padding: "0 20px",
    },
  },
  stepperWrapper: {
    maxWidth: 540,
    paddingTop: 0,
    paddingBottom: 60,
    display: "flex",
    justifyContent: "center",

    [theme.breakpoints.down("xs")]: {
      paddingBottom: 0,
    },
  },
}))

const ServiceIcon = styled.img`
  height: 160px;
  width: auto;
  max-width: 160px;
  margin-bottom: 10px;
`

const HowImg = styled.img`
  width: 100%;
  margin: 0 0 10px 0;
  padding-right: 0;
  max-height: 430px;
`

const CustomConnector = withStyles((theme) => ({
  vertical: {
    padding: 0,
  },
  active: {
    "& $lineVertical": {
      background: theme.palette.secondary.main,
    },
  },
  completed: {
    "& $lineVertical": {
      background: theme.palette.secondary.main,
    },
  },
  lineVertical: {
    width: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    position: "relative",
    left: "4px",
  },
}))(StepConnector)

const CustomStepIconComponent = (props) => {
  const classes = useCustomStepIconComponentStyles()
  const { active, completed, disabled, icon } = props

  return (
    <Box
      component="div"
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      <IconButton className={classes.button} disabled={disabled}>
        <Typography component="p" variant="h6" className={classes.label}>
          {icon}
        </Typography>
      </IconButton>
    </Box>
  )
}

const useCustomStepIconComponentStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 35,
    height: 35,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundColor: theme.palette.secondary.main,
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  completed: {
    backgroundColor: theme.palette.secondary.main,
  },
  label: {
    fontWeight: "bold",
    color: theme.palette.common.white,
    zIndex: 2,
  },
  button: {
    color: theme.palette.common.white,
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
}))

const AccordionSummary = withStyles((theme) => ({
  root: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderBottom: theme.palette.divider,
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
}))(MaterialAccordionSummary)

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MaterialAccordionDetails)

const Question = withStyles((theme) => ({
  root: {
    color: theme.palette.secondary.main,
    textShadow: "1px 1px rgba(0, 0, 0, 0.125)",
    padding: "10px 0",
  },
}))(Typography)

const Answer = withStyles({
  root: {
    lineHeight: "32px",
    padding: "10px 0",
  },
})(Typography)

export default Fatbowl
