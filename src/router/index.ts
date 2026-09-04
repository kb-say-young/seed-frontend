import { createRouter, createWebHistory } from 'vue-router'

// 씨앗 — 2026 트렌드 실험 플로우 (Figma "2026 트렌드 실험 · 진단" 기준)
//  온보딩 → 로그인/회원가입 → 진단 정보 입력(N1~N4/n2b) → 진단 생성 → 로드맵(진단결과)
//  → 목표 상세/체크리스트 → 자금 계획 → 지출·진척 → 홈 / 내정보
//
// 라우트는 각 feature 의 pages/ 를 lazy import 한다 (배럴 경유 금지 = per-route 코드분할 유지).
export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    // onboarding
    { path: '/', name: 'onboarding', component: () => import('@/features/onboarding/pages/Onboarding.vue') },
    { path: '/landing', name: 'landing', component: () => import('@/features/onboarding/pages/Landing.vue') },

    // auth
    { path: '/login', name: 'login', component: () => import('@/features/auth/pages/Login.vue') },
    { path: '/signup', name: 'signup-account', component: () => import('@/features/auth/pages/SignupAccount.vue') },
    { path: '/signup/profile', name: 'signup-profile', component: () => import('@/features/auth/pages/SignupProfile.vue') },
    { path: '/signup/done', name: 'signup-done', component: () => import('@/features/auth/pages/SignupDone.vue') },

    // diagnosis — 정보 입력
    { path: '/intake', name: 'intake-basic', component: () => import('@/features/diagnosis/pages/IntakeBasic.vue') },
    { path: '/intake/income', name: 'intake-income', component: () => import('@/features/diagnosis/pages/IntakeIncome.vue') },
    { path: '/intake/welfare', name: 'intake-welfare', component: () => import('@/features/diagnosis/pages/IntakeWelfare.vue') },
    { path: '/intake/goals', name: 'intake-goals', component: () => import('@/features/diagnosis/pages/IntakeGoals.vue') },
    { path: '/intake/priority', name: 'intake-priority', component: () => import('@/features/diagnosis/pages/IntakePriority.vue') },

    // diagnosis — 결과 / 로드맵
    { path: '/diagnosing', name: 'diagnosing', component: () => import('@/features/diagnosis/pages/Diagnosing.vue') },
    { path: '/roadmap', name: 'roadmap', component: () => import('@/features/diagnosis/pages/Roadmap.vue') },
    { path: '/roadmap/:id', name: 'milestone', component: () => import('@/features/diagnosis/pages/MilestoneDetail.vue') },
    { path: '/roadmap/:id/cost', name: 'cost-record', component: () => import('@/features/diagnosis/pages/CostRecord.vue') },

    // plan — 자금 계획
    { path: '/fund', name: 'fund', component: () => import('@/features/plan/pages/FundPlan.vue') },
    { path: '/fund/ai', name: 'fund-ai', component: () => import('@/features/plan/pages/FundPlanAi.vue') },
    { path: '/fund/allocation', name: 'allocation', component: () => import('@/features/plan/pages/AllocationEdit.vue') },

    // tracking — 지출·진척
    { path: '/tracking', name: 'tracking', component: () => import('@/features/tracking/pages/Tracking.vue') },
    { path: '/tracking/add', name: 'expense-add', component: () => import('@/features/tracking/pages/ExpenseAdd.vue') },
    { path: '/tracking/budget', name: 'tracking-budget', component: () => import('@/features/tracking/pages/TrackingBudget.vue') },

    // home / account
    { path: '/home', name: 'home', component: () => import('@/features/home/pages/Home.vue') },
    { path: '/me', name: 'me', component: () => import('@/features/account/pages/MyInfo.vue') },
    { path: '/me/edit', name: 'me-edit', component: () => import('@/features/account/pages/EditConditions.vue') },

    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
