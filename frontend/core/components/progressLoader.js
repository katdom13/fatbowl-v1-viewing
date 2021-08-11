import React from "react"

import { Box, Typography } from "@material-ui/core"
import Image from "next/image"

const ProgressLoader = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
    >
      <Image src="/loading.gif" alt="loading" width={200} height={200} />
      <Typography variant="body1" gutterBottom style={{ fontWeight: "bold" }}>
        Loading...
      </Typography>
    </Box>
  )
}

export default ProgressLoader
