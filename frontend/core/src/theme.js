import red from "@material-ui/core/colors/red"
import { createTheme, responsiveFontSizes } from "@material-ui/core/styles"

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
  typography: {
    // In Chinese and Japanese the characters are usually larger,
    // so a smaller fontsize may be appropriate.
    fontFamily: "Nunito",
  },
})

export default responsiveFontSizes(theme)
