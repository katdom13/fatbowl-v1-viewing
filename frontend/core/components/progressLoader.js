import React from "react"

import { Avatar, Box, Typography } from "@material-ui/core"

const ProgressLoader = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
    >
      <Avatar
        src="/loading.gif"
        alt="loading"
        style={{
          width: "200px",
          height: "200px",
        }}
      />
      <Typography variant="body1" gutterBottom style={{ fontWeight: "bold" }}>
        Loading...
      </Typography>
    </Box>
  )
}

export default ProgressLoader
