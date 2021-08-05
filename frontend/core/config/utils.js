const getUrlQueryParams = (url, name) => {
  try {
    let param = url.split(/\?/).find(split => split.split('=')[0] === name)
    return param.split('=')[1]
  } catch (error) {
    return ''
  }
}

const getDateTime = (datetimestr) => {
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

  let date = new Date(datetimestr)

  let month = monthNames[date.getMonth() + 1]
  let day = date.getDate().toString().length < 2 ? '0' + date.getDate() : date.getDate()
  let year = date.getFullYear()

  let hours = (date.getHours() + 24) % 12
  hours = hours.toString().length < 2 ? '0' + hours : hours

  let minutes = date.getMinutes().toString().length < 2 ? '0' + date.getMinutes() : date.getMinutes()

  let suffix = date.getHours() >= 12 ? 'pm' : 'am'

  return `
    ${month} ${day}, ${year} - ${hours}:${minutes}${suffix}
  `
}

export {
  getUrlQueryParams,
  getDateTime,
}