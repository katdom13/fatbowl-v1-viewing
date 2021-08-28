import getConfig from "next/config"
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

export const baseUrl =
  serverRuntimeConfig.FATBOWL_API_URI || publicRuntimeConfig.FATBOWL_API_URI
