import { createRouter, createWebHistory, type RouterHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { modules } from '@/data/modules'

export function createAppRouter(history: RouterHistory = createWebHistory()) {
  return createRouter({
    history,
    scrollBehavior: () => ({ top: 0 }),
    routes: [
      {
        path: '/',
        component: AppLayout,
        children: [
          {
            path: '',
            name: 'overview',
            component: () => import('@/views/OverviewView.vue'),
            meta: { title: '能力总览' },
          },
          {
            path: 'lab/:moduleId',
            name: 'lab',
            component: () => import('@/views/LabView.vue'),
            beforeEnter: (to) =>
              modules.some((item) => item.id === to.params.moduleId) || { name: 'not-found' },
            meta: { title: 'API 实验室' },
          },
          {
            path: 'board',
            name: 'board',
            component: () => import('@/views/BoardView.vue'),
            meta: { title: '任务看板' },
          },
          {
            path: 'progress',
            name: 'progress',
            component: () => import('@/views/ProgressView.vue'),
            meta: { title: '学习进度' },
          },
          {
            path: 'guide',
            name: 'guide',
            component: () => import('@/views/GuideView.vue'),
            meta: { title: '学习指南' },
          },
          {
            path: 'not-found',
            name: 'not-found',
            component: () => import('@/views/NotFoundView.vue'),
            meta: { title: '页面未找到' },
          },
          { path: ':pathMatch(.*)*', redirect: { name: 'not-found' } },
        ],
      },
    ],
  })
}
