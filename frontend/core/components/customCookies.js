import nookies from "nookies"

class customCookies {
  constructor() {}
  static get(name) {
    return nookies.get(null)[name]
  }
  static set(name, value) {
    nookies.set(null, name, value)
  }
  static remove(name) {
    return nookies.destroy(null, name)
  }
}

export default customCookies
