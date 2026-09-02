import { createRouter, createWebHistory } from 'vue-router'

// 씨앗 — 2026 트렌드 실험 플로우 (Figma "2026 트렌드 실험 · 진단" 기준)
//  온보딩 → 로그인/회원가입 → 진단 정보 입력(N1~N4/n2b) → 진단 생성 → 로드맵(진단결과)
//  → 목표 상세/체크리스트 → 자금 계획 → 지출·진척 → 홈 / 내정보
export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'onboarding', component: () => import('./pages/Onboarding.vue') },
    { path: '/landing', name: 'landing', component: () => import('./pages/Landing.vue') },
    { path: '/login', name: 'login', component: () => import('./pages/Login.vue') },

    { path: '/signup', name: 'signup-account', component: () => import('./pages/SignupAccount.vue') },
    { path: '/signup/profile', name: 'signup-profile', component: () => import('./pages/SignupProfile.vue') },
    { path: '/signup/done', name: 'signup-done', component: () => import('./pages/SignupDone.vue') },

    { path: '/intake', name: 'intake-basic', component: () => import('./pages/IntakeBasic.vue') },
    { path: '/intake/income', name: 'intake-income', component: () => import('./pages/IntakeIncome.vue') },
    { path: '/intake/welfare', name: 'intake-welfare', component: () => import('./pages/IntakeWelfare.vue') },
    { path: '/intake/goals', name: 'intake-goals', component: () => import('./pages/IntakeGoals.vue') },
    { path: '/intake/priority', name: 'intake-priority', component: () => import('./pages/IntakePriority.vue') },

    { path: '/diagnosing', name: 'diagnosing', component: () => import('./pages/Diagnosing.vue') },
    { path: '/roadmap', name: 'roadmap', component: () => import('./pages/Roadmap.vue') },
    { path: '/roadmap/:id', name: 'milestone', component: () => import('./pages/MilestoneDetail.vue') },
    { path: '/roadmap/:id/cost', name: 'cost-record', component: () => import('./pages/CostRecord.vue') },

    { path: '/fund', name: 'fund', component: () => import('./pages/FundPlan.vue') },
    { path: '/fund/ai', name: 'fund-ai', component: () => import('./pages/FundPlanAi.vue') },
    { path: '/fund/allocation', name: 'allocation', component: () => import('./pages/AllocationEdit.vue') },

    { path: '/tracking', name: 'tracking', component: () => import('./pages/Tracking.vue') },
    { path: '/tracking/add', name: 'expense-add', component: () => import('./pages/ExpenseAdd.vue') },
    { path: '/tracking/budget', name: 'tracking-budget', component: () => import('./pages/TrackingBudget.vue') },

    { path: '/home', name: 'home', component: () => import('./pages/Home.vue') },
    { path: '/me', name: 'me', component: () => import('./pages/MyInfo.vue') },
    { path: '/me/edit', name: 'me-edit', component: () => import('./pages/EditConditions.vue') },

    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
