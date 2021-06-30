import axios from 'axios'
import { baseUrl } from './baseUrl'

let axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json'
  }
})

// Promises
const loginUser = async (username, password, csrf) => {
  const body = {username, password}
  return axiosInstance.post(
    'account/login/',
    body,
    {
      headers: {
        ...axiosInstance.defaults.headers,
        'X-CSRFToken': csrf
      }
    }
  )
    .then(response => Promise.resolve(response.data))
    .catch(error => Promise.reject(error))
}

const logoutUser = async () => {
  return axiosInstance.get('account/logout/')
    .then(response => Promise.resolve(response.data))
    .catch(error => Promise.reject(error))
}

const getCsrf = async () => {
  return axiosInstance.get('account/csrf')
    .then(response => Promise.resolve(response.headers['x-csrftoken']))
    .catch(error => Promise.reject(error))
}

const whoami = async () => {
  await axiosInstance.get('account/whoami/')
    .then(response => console.log('[WHOAMI]', response.data.username))
    .catch(err => console.error('[WHOAMI ERROR]', err))
}

const whoami2 = async () => {
  return axiosInstance.get('account/whoami/')
    .then(response => Promise.resolve(response.data.username))
    .catch(error => Promise.reject(error))
}

const getCategories = async () => {
  return axiosInstance.get('api/categories')
    .then(response => Promise.resolve(response.data))
    .catch(error => Promise.reject(error))
}

const getCartItems = async () => {
  return axiosInstance.get('api/cart/')
    .then(response => Promise.resolve(response.data))
    .catch(error => Promise.reject(error))
}

const addCartItem = async (body, csrf) => {
  return axiosInstance.post(
    'api/cart/',
    body,
    {
      headers: {
        ...axiosInstance.defaults.headers,
        'X-CSRFToken': csrf
      }
    }
  )
    .then(response => Promise.resolve(response.data))
    .catch(error => Promise.reject(error))
}

const deleteCartItem = async (id, csrf) => {
  return axiosInstance.delete(
    `api/cart/${encodeURIComponent(id)}/`,
    {
      headers: {
        ...axiosInstance.defaults.headers,
        'X-CSRFToken': csrf
      }
    }
  )
    .then(response => Promise.resolve(response.data))
    .catch(error => Promise.reject(error))
}

const updateCartItem = async (id, body, csrf) => {
  return axiosInstance.put(
    `api/cart/${encodeURIComponent(id)}/`,
    body,
    {
      headers: {
        ...axiosInstance.defaults.headers,
        'X-CSRFToken': csrf
      }
    }
  )
    .then(response => Promise.resolve(response.data))
    .catch(error => Promise.reject(error))
}

const getCartItemQty = async () => {
  return getCartItems()
    .then(response => Promise.resolve(response.total_item_qty))
    .catch(error => Promise.reject(error))
}

const getProducts = async (category = '') => {
  let url = 'api/products/'

  if (Boolean(category)) {
    url += `category/${category}/`
  }

  return axiosInstance.get(url)
    .then(response => Promise.resolve(response.data))
    .catch(error => Promise.reject(error))
}

const getProduct = async slug => {
  return axiosInstance.get(`api/products/${slug}`)
    .then(response => Promise.resolve(response.data))
    .catch(error => Promise.reject(error))
}

export {
  loginUser,
  logoutUser,
  getCsrf,
  whoami,
  whoami2,
  getCategories,
  getCartItems,
  addCartItem,
  deleteCartItem,
  updateCartItem,
  getCartItemQty,
  getProducts,
  getProduct,
}
