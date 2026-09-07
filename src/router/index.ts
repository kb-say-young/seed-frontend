import { ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

// 화면 전환 방향 힌트 — "앞으로/뒤로" 만 알려주는 아주 작은 모션(12px·~180ms).
// 직전 경로로 돌아가면 back, 그 외에는 forward. reduced-motion 이면 style.css 에서 정지.
export const navDir = ref<'forward' | 'back'>('forward')
const pathStack: string[] = []

// 씨앗 — 2026 트렌드 실험 플로우 (Figma "2026 트렌드 실험 · 진단" 기준)
//  온보딩 → 로그인/회원가입 → 진단 정보 입력(N1~N3) → 진단 생성 → 로드맵(진단결과)
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

    // diagnosis — 결과 / 로드맵
    { path: '/diagnosing', name: 'diagnosing', component: () => import('@/features/diagnosis/pages/Diagnosing.vue') },
    { path: '/roadmap', name: 'roadmap', component: () => import('@/features/diagnosis/pages/Roadmap.vue') },
    { path: '/roadmap/:id', name: 'milestone', component: () => import('@/features/diagnosis/pages/MilestoneDetail.vue') },
    { path: '/roadmap/:id/policy', name: 'policy-detail', component: () => import('@/features/diagnosis/pages/PolicyDetail.vue') },
    { path: '/roadmap/:id/cost', name: 'cost-record', component: () => import('@/features/diagnosis/pages/CostRecord.vue') },

    // plan — 자금 계획
    { path: '/fund', name: 'fund', component: () => import('@/features/plan/pages/FundPlan.vue') },
    { path: '/fund/ai', name: 'fund-ai', component: () => import('@/features/plan/pages/FundPlanAi.vue') },
    { path: '/fund/allocation', name: 'allocation', component: () => import('@/features/plan/pages/AllocationEdit.vue') },

    // savings — 모은 돈(적립 추적)
    { path: '/savings', name: 'savings', component: () => import('@/features/savings/pages/Savings.vue') },
    { path: '/savings/:category', name: 'savings-category', component: () => import('@/features/savings/pages/SavingsCategory.vue') },

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

// 컴포넌트 스왑(=트랜지션 시작) 전에 방향을 확정해 <Transition :name> 이 최신값을 읽게 한다.
router.beforeEach((to) => {
  if (pathStack.length >= 2 && pathStack[pathStack.length - 2] === to.path) {
    navDir.value = 'back'
    pathStack.pop()
  } else {
    navDir.value = 'forward'
    if (pathStack[pathStack.length - 1] !== to.path) pathStack.push(to.path)
  }
})
