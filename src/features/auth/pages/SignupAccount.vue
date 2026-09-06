<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import WizardChrome from '@/shared/components/WizardChrome.vue'
import UiField from '@/shared/ui/UiField.vue'

const router = useRouter()
const id = ref('')
const pw = ref('')
const canNext = computed(() => id.value.length >= 4 && pw.value.length >= 8)
</script>

<template>
  <WizardChrome
    title="회원가입"
    :step="1"
    :total="3"
    step-label="계정"
    back-to="/"
    :can-next="canNext"
    @next="router.push('/signup/profile')"
  >
    <p class="text-body-sm text-muted">로그인에 쓸 아이디와 비밀번호를 정해요</p>
    <div class="flex flex-col gap-4">
      <UiField
        v-model="id"
        label="아이디"
        required
        placeholder="영문·숫자 4자 이상"
        hint="다른 사람에게 보이지 않아요"
      />
      <UiField
        v-model="pw"
        label="비밀번호"
        type="password"
        required
        placeholder="8자 이상"
        hint="영문·숫자·기호를 섞으면 더 안전해요"
      />
    </div>
  </WizardChrome>
</template>
