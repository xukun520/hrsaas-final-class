import Layout from '@/layout'

export default {
  path: '/permission',
  name: 'permissions',
  component: Layout,
  children: [
    {
      path: '',
      name: 'permissions',
      component: () => import('@/views/permission/index'),
      meta: {
        title: '权限管理',
        icon: 'lock'
      }
    }
  ]
}
