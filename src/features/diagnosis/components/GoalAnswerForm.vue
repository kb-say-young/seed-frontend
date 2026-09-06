<script setup lang="ts">
import UiChip from '@/shared/ui/UiChip.vue'
import UiField from '@/shared/ui/UiField.vue'
import RegionSelect from './RegionSelect.vue'
import { GOAL_ANSWER_SCHEMA, type FieldSchema, type ExperienceValue } from '@/features/diagnosis/model/goalSchemas'
import type { SubCategoryCode } from '@/features/diagnosis/model/store'

// sub_category 스키마(goalSchemas.ts)를 순회해 추가질문 폼을 렌더링한다.
// answers 는 state.goals[i].answers 그대로 넘어오는 반응형 객체라 직접 mutate 한다
// (이 코드베이스의 다른 위저드 화면들과 동일하게 emit 없이 state 직접 수정).
const props = defineProps<{ sub: SubCategoryCode; answers: Record<string, unknown> }>()

const schema = () => GOAL_ANSWER_SCHEMA[props.sub]
const optionsOf = (f: FieldSchema) => f.optionsFor?.(props.answers) ?? f.options ?? []

function setEnum(key: string, value: string) {
  props.answers[key] = value
}

function multiValues(key: string): string[] {
  return (props.answers[key] as string[] | undefined) ?? []
}
function toggleMulti(key: string, value: string) {
  const cur = multiValues(key)
  props.answers[key] = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]
}

function textValue(key: string): string {
  return (props.answers[key] as string | undefined) ?? ''
}
function setText(key: string, value: string) {
  props.answers[key] = value
}

function intValue(key: string): string {
  const n = props.answers[key] as number | null | undefined
  return n == null ? '' : String(n)
}
function setInt(key: string, value: string) {
  const n = parseInt(value.replace(/\D/g, ''), 10)
  props.answers[key] = Number.isFinite(n) ? n : null
}

function moneyValue(key: string): string {
  const n = props.answers[key] as number | null | undefined
  return n == null ? '' : n.toLocaleString('ko-KR')
}
function setMoney(key: string, value: string) {
  const n = Number(value.replace(/[^\d]/g, ''))
  props.answers[key] = Number.isFinite(n) && n > 0 ? n : null
}

function experienceOf(key: string): ExperienceValue {
  return (props.answers[key] as ExperienceValue | undefined) ?? { type: 'NEW', months: null }
}
function setExperienceType(key: string, type: ExperienceValue['type']) {
  props.answers[key] = { type, months: type === 'NEW' ? null : experienceOf(key).months }
}
function setExperienceMonths(key: string, value: string) {
  const n = parseInt(value.replace(/\D/g, ''), 10)
  const cur = experienceOf(key)
  props.answers[key] = { ...cur, months: Number.isFinite(n) ? n : null }
}

function setRegion(key: string, value: string) {
  props.answers[key] = value
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <template v-for="f in schema()" :key="f.key">
      <div v-if="f.kind === 'region'">
        <RegionSelect
          :label="f.label"
          :required="f.required"
          :model-value="(answers[f.key] as string) ?? ''"
          @update:model-value="setRegion(f.key, $event)"
        />
      </div>

      <fieldset v-else-if="f.kind === 'enum-chip'">
        <legend class="mb-1.5 text-label text-ink">
          {{ f.label }}<span v-if="f.required" class="text-danger" aria-hidden="true"> *</span>
        </legend>
        <div class="flex flex-wrap gap-2" role="radiogroup" :aria-label="f.label">
          <UiChip
            v-for="opt in optionsOf(f)"
            :key="opt.value"
            :label="opt.label"
            :selected="answers[f.key] === opt.value"
            @toggle="setEnum(f.key, opt.value)"
          />
        </div>
        <p v-if="f.hint" class="mt-1.5 text-body-sm text-muted">{{ f.hint }}</p>
      </fieldset>

      <fieldset v-else-if="f.kind === 'multi-chip'">
        <legend class="mb-1.5 text-label text-ink">
          {{ f.label }}<span v-if="f.required" class="text-danger" aria-hidden="true"> *</span>
        </legend>
        <div class="flex flex-wrap gap-2">
          <UiChip
            v-for="opt in optionsOf(f)"
            :key="opt.value"
            :label="opt.label"
            :selected="multiValues(f.key).includes(opt.value)"
            @toggle="toggleMulti(f.key, opt.value)"
          />
        </div>
        <p v-if="f.hint" class="mt-1.5 text-body-sm text-muted">{{ f.hint }}</p>
      </fieldset>

      <fieldset v-else-if="f.kind === 'boolean-chip'">
        <legend class="mb-1.5 text-label text-ink">
          {{ f.label }}<span v-if="f.required" class="text-danger" aria-hidden="true"> *</span>
        </legend>
        <div class="flex gap-2" role="radiogroup" :aria-label="f.label">
          <UiChip label="예" :selected="answers[f.key] === true" @toggle="answers[f.key] = true" />
          <UiChip label="아니오" :selected="answers[f.key] === false" @toggle="answers[f.key] = false" />
        </div>
        <p v-if="f.hint" class="mt-1.5 text-body-sm text-muted">{{ f.hint }}</p>
      </fieldset>

      <UiField
        v-else-if="f.kind === 'money'"
        :label="f.label"
        :required="f.required"
        :suffix="f.suffix"
        :hint="f.hint"
        placeholder="0"
        inputmode="numeric"
        :model-value="moneyValue(f.key)"
        @update:model-value="setMoney(f.key, $event)"
      />

      <UiField
        v-else-if="f.kind === 'int'"
        :label="f.label"
        :required="f.required"
        :suffix="f.suffix"
        :hint="f.hint"
        placeholder="0"
        inputmode="numeric"
        :model-value="intValue(f.key)"
        @update:model-value="setInt(f.key, $event)"
      />

      <UiField
        v-else-if="f.kind === 'text'"
        :label="f.label"
        :required="f.required"
        :hint="f.hint"
        :model-value="textValue(f.key)"
        @update:model-value="setText(f.key, $event)"
      />

      <div v-else-if="f.kind === 'experience'">
        <fieldset>
          <legend class="mb-1.5 text-label text-ink">
            {{ f.label }}<span v-if="f.required" class="text-danger" aria-hidden="true"> *</span>
          </legend>
          <div class="flex gap-2" role="radiogroup" :aria-label="f.label">
            <UiChip
              label="신입"
              :selected="experienceOf(f.key).type === 'NEW'"
              @toggle="setExperienceType(f.key, 'NEW')"
            />
            <UiChip
              label="경력"
              :selected="experienceOf(f.key).type === 'EXPERIENCED'"
              @toggle="setExperienceType(f.key, 'EXPERIENCED')"
            />
          </div>
        </fieldset>
        <UiField
          v-if="experienceOf(f.key).type === 'EXPERIENCED'"
          class="mt-3"
          label="경력 기간"
          required
          suffix="개월"
          placeholder="0"
          inputmode="numeric"
          :model-value="experienceOf(f.key).months == null ? '' : String(experienceOf(f.key).months)"
          @update:model-value="setExperienceMonths(f.key, $event)"
        />
      </div>
    </template>
  </div>
</template>
