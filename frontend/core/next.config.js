module.exports = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    // Will only be available on the server side
    FATBOWL_API_URI: "http://fatbowl:8000/api/v1",
  },
  publicRuntimeConfig: {
    FATBOWL_API_URI: "http://localhost:8000/api/v1",
  },
  images: {
    // loader: "imgix",
    // path: "https://ec2-13-229-75-63.ap-southeast-1.compute.amazonaws.com",
    // domains: ["ec2-13-229-75-63.ap-southeast-1.compute.amazonaws.com"],
    // // path: "",
    // // domains: [],
    domains: ["localhost"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
}
