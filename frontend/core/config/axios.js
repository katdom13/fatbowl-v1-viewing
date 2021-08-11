import axios from "axios"

import { baseUrl } from "./baseUrl"

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 12000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
})

const invoke = async (url, method = "get", data = {}, csrf = "") => {
  return instance({
    method: method,
    url: url,
    data: data,
    headers: {
      ...instance.defaults.headers,
      "X-CSRFToken": csrf,
    },
  })
    .then((response) => Promise.resolve(response.data))
    .catch((error) => Promise.reject(error))
}

// Promises

const getCsrf = async () => {
  return invoke("account/csrf/")
}

const whoami = async () => {
  const data = await invoke("account/whoami/")
  return data.username
}

const loginUser = async (username, password, csrf) => {
  const data = { username, password }
  return invoke("account/login/", "post", data, csrf)
}

const logoutUser = async () => {
  return invoke("account/logout/")
}

const getCategories = async () => {
  return invoke("store/categories/")
}

const getCart = async (publicId = "") => {
  return invoke(`cart/${publicId}`)
}

const addCartItem = async (data, csrf) => {
  return invoke("cart/", "post", data, csrf)
}

const deleteCartItem = async (itemId, csrf) => {
  return invoke(`cart/${encodeURIComponent(itemId)}/`, "delete", undefined, csrf)
}

const updateCartItem = async (itemId, data, csrf) => {
  return invoke(`cart/${encodeURIComponent(itemId)}/`, "put", data, csrf)
}

const getCartItemQty = async () => {
  const data = await getCart()
  return data.total_qty
}

const getProducts = async (category = "") => {
  let url = "store/products/"
  url += category ? `category/${category}` : ""

  return invoke(url)
}

const getProduct = async (slug) => {
  return invoke(`store/products/${slug}/`)
}

const register = async (data, csrf) => {
  return invoke("account/users/", "post", data, csrf)
}

const getUser = async (username) => {
  return invoke(`account/users/${username}`)
}

const updateUser = async (username, data, csrf) => {
  return invoke(`account/users/${username}/`, "put", data, csrf)
}

const deleteUser = async (username, csrf) => {
  return invoke(`account/users/${username}/`, "delete", undefined, csrf)
}

const activateUser = async (uidb64, token) => {
  return invoke(`account/activate/${uidb64}/${token}/`)
}

const forgotPassword = async (email, csrf) => {
  return invoke("account/password_reset/", "post", { email }, csrf)
}

const passwordReset = async (uidb64, token, password, csrf) => {
  return invoke(
    `account/password_reset_confirm/${uidb64}/${token}/`,
    "post",
    { password },
    csrf
  )
}

const getAddresses = async () => {
  return invoke("account/address/")
}

const getAddress = async (publicId) => {
  return invoke(`account/address/${publicId}/`)
}

const createAddress = async (data, csrf) => {
  return invoke("account/address/", "post", data, csrf)
}

const updateAddress = async (publicId, data, csrf) => {
  return invoke(`account/address/${publicId}/`, "put", data, csrf)
}

const deleteAddress = async (publicId, csrf) => {
  return invoke(`account/address/${publicId}/`, "delete", undefined, csrf)
}

const getWishlist = async () => {
  return invoke("account/wishlist/")
}

const updateWishlist = async (itemId, csrf) => {
  return invoke(`account/wishlist/${itemId}/`, "put", undefined, csrf)
}

const getDeliveryOptions = async () => {
  return invoke("checkout/delivery_options/")
}

const payment = async (orderId, address, csrf) => {
  const addressData = {
    phone_number: address.phone_number,
    address_line_1: address.address_line_1,
    address_line_2: address.address_line_2,
    town_city: address.town_city,
    postcode: address.postcode,
  }

  return invoke(
    "checkout/payment/",
    "post",
    {
      order_id: orderId,
      address: addressData,
    },
    csrf
  )
}

const getOrders = async () => {
  return invoke("account/orders/")
}

export {
  whoami,
  loginUser,
  logoutUser,
  getCsrf,
  getCategories,
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
  getOrders,
}
