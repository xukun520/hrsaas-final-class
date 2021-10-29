import Layout from '@/layout'

export default {
  path: '/employees',
  name: 'employees',
  component: Layout,
  children: [
    {
      path: '',
      name: 'employees',
      component: () => import('@/views/employees/index'),
      meta: {
        title: '员工信息',
        icon: 'people'
      }
    },
    {
      path: '/employees/detail/:id',
      name: 'detail',
      component: () => import('@/views/employees/detail'),
      hidden: true,
      meta: {
        title: '员工详情信息'
      }
    },
    {
      path: '/employees/print/:id',
      name: 'print',
      component: () => import('@/views/employees/components/print'),
      hidden: true,
      meta: {
        title: '打印员工信息',
        icon: 'people'
      }
    }
  ]
}
