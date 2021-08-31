import { Box } from "@material-ui/core"
import { styled } from "@material-ui/core/styles"

const ParallaxImage = styled(Box)((props) => ({
  position: "relative",
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundColor: props.darken ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.30)",
  backgroundBlendMode: props.darken ? "darken" : "lighten",
  backgroundAttachment: "fixed",
  backgroundImage: `url(${props.image})`,
  minHeight: props.height ? props.height : "100vh",
  color: props.darken ? "#f7f8fa" : "#010606",
  textShadow: props.darken ? "1px 1px #323232" : "none",
  display: "flex",
  alignItems: "center",
}))

export default ParallaxImage
