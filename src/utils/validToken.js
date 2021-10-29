import defaultSettings from '@/settings'
import { getTokenTimeOut } from '@/utils/auth'

const { tokenTimeOutVal } = defaultSettings

export function isValidToken() {
  // 当前时间
  const stampEnd = Date.now()
  // 登录时注入的时间
  const stampStart = getTokenTimeOut()
  // return Boolean
  return ((stampEnd - stampStart) / 1000) > tokenTimeOutVal
}
