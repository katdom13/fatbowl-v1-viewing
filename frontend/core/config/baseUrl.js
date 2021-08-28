let url

if (Boolean(process.env.FROM_DOCKER)) {
  url = `http://fatbowl:8000/api/v1/`
} else {
  url = `http://localhost:8000/api/v1/`
}

export const baseUrl = url
