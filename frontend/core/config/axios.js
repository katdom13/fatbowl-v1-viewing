import axios from 'axios'
import { baseUrl } from './baseUrl'

let axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 12000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json'
  }
})

// Promises
const whoami = async () => {
  return axiosInstance.get('account/whoami/')
    .then(response => Promise.resolve(response.data.username))
    .catch(error => Promise.reject(error))
}

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
  return axiosInstance.get('account/csrf/')
    .then(response => Promise.resolve(response.headers['x-csrftoken']))
    .catch(error => Promise.reject(error))
}

const getCategories = async () => {
  return axiosInstance.get('api/categories/')
    .then(response => Promise.resolve(response.data))
    .catch(error => Promise.reject(error))
}

const getCart = async publicId => {
  return axiosInstance.get(`api/cart/${publicId}`)
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
    .then(response => Promise.resolve(response.total_qty))
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
  return axiosInstance.get(`api/products/${slug}/`)
    .then(response => Promise.resolve(response.data))
    .catch(error => Promise.reject(error))
}

const register = async (data, csrf) => {
  return axiosInstance.post(
    'account/users/',
    data,
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

const getUser = async (username, csrf) => {
  return axiosInstance.get(
    `account/users/${username}/`,
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

const updateUser = async (username, data, csrf) => {
  return axiosInstance.put(
    `account/users/${username}/`,
    data,
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

const deleteUser = async (username, csrf) => {
  return axiosInstance.delete(
    `account/users/${username}/`,
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

const activateUser = async (uidb64, token, csrf) => {
  return axiosInstance.get(
    `account/activate/${uidb64}/${token}/`,
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

const forgotPassword = async (email, csrf) => {
  return axiosInstance.post(
    'account/password_reset/',
    {email,},
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

const passwordReset = async (uidb64, token, password, csrf) => {
  return axiosInstance.post(
    `account/password_reset_confirm/${uidb64}/${token}/`,
    {password,},
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

const getAddresses = async () => {
  return axiosInstance.get('account/address/')
    .then(response => Promise.resolve(response.data))
    .catch(error => Promise.reject(error))
}

const getAddress = async public_id => {
  return axiosInstance.get(
    `account/address/${public_id}/`
  )
    .then(response => Promise.resolve(response.data))
    .catch(error => Promise.reject(error))
}

const createAddress = async (body, csrf) => {
  return axiosInstance.post(
    'account/address/',
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

const updateAddress = async (public_id, body, csrf) => {
  return axiosInstance.put(
    `account/address/${public_id}/`,
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

const deleteAddress = async (public_id, csrf) => {
  return axiosInstance.delete(
    `account/address/${public_id}/`,
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

const getWishlist = async () => {
  return axiosInstance.get('account/wishlist/')
    .then(response => Promise.resolve(response.data))
    .catch(error => Promise.reject(error))
}

const updateWishlist = async (item_id, csrf) => {
  return axiosInstance.put(
    `account/wishlist/${item_id}/`,
    {},
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

const getDeliveryOptions = async () => {
  return axiosInstance.get(
    'checkout/delivery_options/'
  )
    .then(response => Promise.resolve(response.data))
    .catch(error => Promise.reject(error))
}

const payment = async (orderId, address, csrf) => {
  console.log('!!!!ZZZZZZZZZZZ', orderId, csrf, address)
  const addressBody = {
    'address_line_1': address.address_line_1,
    'address_line_2': address.address_line_2,
    'town_city': address.town_city,
    'postcode': address.postcode,
  }
  return axiosInstance.post(
    'checkout/payment/',
    {
      'order_id': orderId,
      'address': addressBody
    },
    {
      headers: {
        ...axiosInstance.defaults.headers,
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'X-CSRFToken': csrf
      }
    }
  )
    .then(response => Promise.resolve(response.data))
    .catch(error => Promise.reject(error))
}

export {
  axiosInstance,
  whoami,
  loginUser,
  logoutUser,
  getCsrf,
  getCategories,
  getCartItems,
  getCart,
  addCartItem,
  deleteCartItem,
  updateCartItem,
  getCartItemQty,
  getProducts,
  getProduct,
  register,
  getUser,
  updateUser,
  deleteUser,
  activateUser,
  forgotPassword,
  passwordReset,
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  getWishlist,
  updateWishlist,
  getDeliveryOptions,
  payment,
}
