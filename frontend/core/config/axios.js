import axios from "axios"
import Router from "next/router"

import customCookies from "../components/customCookies"
import { baseUrl } from "./baseUrl"

const cookies = customCookies

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 12000,
  withCredentials: true,
  headers: {
    Authorization: cookies.get("access_token")
      ? "Bearer " + cookies.get("access_token")
      : null,
    "Content-Type": "application/json",
    accept: "application/json",
  },
})

instance.interceptors.response.use(
  (response) => {
    return response
  },
  async function (error) {
    const originalRequest = error.config

    if (typeof error.response === "undefined") {
      alert(
        "A server/network error occurred. " +
          "Looks like CORS might be the problem. " +
          "Sorry about this - we will get it fixed shortly."
      )
      return Promise.reject(error)
    }

    if (
      error.response.status === 401 &&
      originalRequest.url === baseUrl + "account/token/refresh/"
    ) {
      Router.push("/login")
      return Promise.reject(error)
    }

    if (
      error.response.data.code === "token_not_valid" &&
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized"
    ) {
      const refreshToken = cookies.get("refresh_token")

      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]))

        // exp date in token is expressed in seconds, while now() returns milliseconds:
        const now = Math.ceil(Date.now() / 1000)
        console.log(tokenParts.exp)

        if (tokenParts.exp > now) {
          return instance
            .post("account/token/refresh/", { refresh: refreshToken })
            .then((response) => {
              cookies.set("access_token", response.data.access)
              cookies.set("refresh_token", response.data.refresh)

              instance.defaults.headers["Authorization"] =
                "Bearer " + response.data.access
              originalRequest.headers["Authorization"] =
                "Bearer " + response.data.access

              return instance(originalRequest)
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          console.log("Refresh token is expired", tokenParts.exp, now)
          Router.push("/login")
        }
      } else {
        console.log("Refresh token not available.")
        Router.push("/login")
      }
    }

    // specific error handling done elsewhere
    return Promise.reject(error)
  }
)

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
  return instance
    .get("account/csrf")
    .then((response) => Promise.resolve(response))
    .catch((error) => Promise.reject(error))
}

const whoami = async () => {
  const data = await invoke("account/whoami/")
  return data.username
}

const loginUser = async (username, password, csrf = "") => {
  const data = { username, password }

  return instance
    .post("account/token/", data)
    .then((response) => Promise.resolve(response))
    .catch((error) => Promise.reject(error))
}

const logoutUser = async (refreshToken) => {
  const data = { refresh_token: refreshToken }
  return invoke("account/logout/", "post", data)
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
  instance,
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
