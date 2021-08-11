import { Typography, styled } from "@material-ui/core"

const PageTitle = styled(Typography)((props) => ({
  fontWeight: "bold",
  fontSize: 22,
  margin: props.theme.spacing(1, 0, 1, 0),
  [props.theme.breakpoints.up("md")]: {
    margin: props.theme.spacing(2, 0, 2, 0),
  },
}))

export default PageTitle
