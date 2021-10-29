import Cookies from 'js-cookie'

const TokenKey = 'vue_backstage_token'
const TokenTimeOutKey = 'vue_backstage_token_timeout'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setTokenTimeOut() {
  return Cookies.set(TokenTimeOutKey, Date.now())
}

export function getTokenTimeOut() {
  return Cookies.get(TokenTimeOutKey)
}
