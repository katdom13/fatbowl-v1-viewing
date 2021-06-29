import axios from 'axios'
import { baseUrl } from './baseUrl'

let tokenRequest = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json',
  }
})

const loginUser = (username, password, csrf) => {
  const loginBody = {username, password}
  return tokenRequest.post('account/login/', loginBody, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrf
    }
  })
    .then(response => Promise.resolve(response.data))
    .catch(error => Promise.reject(error))
}

const logoutUser = () => {
  return axiosInstance.get('account/logout/')
    .then(response => Promise.resolve(response.data))
    .catch(error => Promise.reject(error))
}

const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
})

const whoami = async () => {
  await axiosInstance.get('account/whoami/')
    .then(response => console.log('[WHOAMI]', response.data.username))
    .catch(err => console.error('[WHOAMI ERROR]', err))
}

export { tokenRequest, loginUser, logoutUser, axiosInstance, whoami, }
