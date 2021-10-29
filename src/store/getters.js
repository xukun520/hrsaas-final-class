const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  companyId: state => state.user.userInfo.companyId,
  avatar: state => state.user.userInfo.staffPhoto,
  routes: state => state.permission.routes,
  userInfo:state=>state.user.userInfo
}
export default getters
