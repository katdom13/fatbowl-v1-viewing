const getUrlQueryParams = (url, name) => {
  try {
    let param = url.split(/\?/).find(split => split.split('=')[0] === name)
    return param.split('=')[1]
  } catch (error) {
    return ''
  }
}

export {
  getUrlQueryParams,
}