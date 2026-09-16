<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { modules, lessonId } from '@/data/modules'
import { useProgressStore } from '@/stores/progress'
import AppIcon from '@/components/AppIcon.vue'
import CodeEditor from '@/components/CodeEditor.vue'

const route = useRoute()
const module = computed(() => modules.find((item) => item.id === route.params.moduleId))
const selected = ref(module.value?.topics[0] || '')
const count = ref(0)
const logs = ref<string[]>([])
const progress = useProgressStore()
const isReady = computed(() => module.value?.id === 'reactivity' && selected.value === 'ref')
const id = computed(() => lessonId(module.value?.id || '', selected.value))

const scriptEnd = '</' + 'script>'

const source = ref(
  `
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
${scriptEnd}

<template>
  <main class="demo">
    <h1>
      Vue Playground
    </h1>

    <p>
      当前数量：{{ count }}
    </p>

    <button @click="increment">
      +1
    </button>
  </main>
</template>

<style scoped>
.demo {
  padding: 40px;
}

h1 {
  margin-bottom: 20px;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}
</style>
`.trim(),
)

function updateCount(delta: number) {
  count.value += delta
  logs.value = [...logs.value, `count.value → ${count.value}`].slice(-20)
}
function reset() {
  count.value = 0
  logs.value = [...logs.value, 'reset → 0'].slice(-20)
}
watch(selected, () => {
  count.value = 0
  logs.value = []
})
</script>
<template>
  <template v-if="module"
    ><div class="page-heading">
      <div>
        <h1>{{ module.title }}</h1>
        <p>{{ module.description }}</p>
      </div>
      <span class="pill"
        >{{ module.topics.length }} 个知识点 · {{ progress.count(module.id) }} 个已掌握</span
      >
    </div>
    <div class="lesson-pills" role="group" aria-label="选择知识点">
      <button
        v-for="topic in module.topics"
        :key="topic"
        :class="{ active: selected === topic }"
        :aria-pressed="selected === topic"
        @click="selected = topic"
      >
        {{ topic
        }}<AppIcon
          v-if="progress.mastered.includes(lessonId(module.id, topic))"
          name="check"
          :size="14"
        />
      </button>
    </div>
    <div class="lab-grid">
      <section class="panel lesson-description">
        <span class="eyebrow">01 / 理解概念</span>
        <h2>{{ selected }}</h2>
        <p>
          {{
            isReady
              ? 'ref 接收一个初始值，返回一个响应式引用。在脚本中用 .value 读写，在模板中会自动解包。点击下方按钮，观察数据、视图和日志如何同步变化。'
              : `这个实验还在计划中。当前已为 ${selected} 准备好统一的学习页面，后续将在这里补充原理说明和可交互示例。`
          }}
        </p>
        <div class="scenario">
          <AppIcon name="bolt" :size="18" /><span>应用场景：{{ module.scenario }}</span>
        </div>
      </section>
      <section class="panel demo-panel">
        <div class="panel-heading">
          <span class="eyebrow">02 / 交互实验</span
          ><span class="pill" :class="{ 'text-green': isReady }">{{
            isReady ? '可运行' : '待实现'
          }}</span>
        </div>
        <template v-if="isReady"
          ><div class="counter-demo">
            <span>响应式计数器</span
            ><output aria-live="polite" aria-label="当前计数">{{ count }}</output>
            <div>
              <button class="button secondary" aria-label="减少计数" @click="updateCount(-1)">
                −</button
              ><button class="button primary" aria-label="增加计数" @click="updateCount(1)">
                + 增加</button
              ><button class="button secondary" @click="reset">重置</button>
            </div>
          </div></template
        >
        <div v-else class="empty-state compact-empty">
          <AppIcon :name="module.icon" :size="36" />
          <h3>下一个值得动手的实验</h3>
          <p>先从已开放的 ref 实验熟悉学习流程。</p>
          <RouterLink to="/lab/reactivity" class="text-link">前往响应式基础 →</RouterLink>
        </div>
      </section>
      <section class="panel source-panel">
        <code-editor v-model:source="source" />
      </section>
      <section class="panel console-panel">
        <div class="panel-heading">
          <span class="eyebrow">04 / 控制台输出</span
          ><button class="text-button" :disabled="!logs.length" @click="logs = []">清空</button>
        </div>
        <div class="console-output" role="log" aria-label="实验日志">
          <p v-if="!logs.length" class="muted">
            {{ isReady ? '// 操作计数器，在这里观察状态变化。' : '// 等待实验实现。' }}
          </p>
          <p v-for="(log, index) in logs" :key="index">
            <span>{{ String(index + 1).padStart(2, '0') }}</span> {{ log }}
          </p>
        </div>
      </section>
    </div>
    <div class="mastery-bar">
      <div>
        <strong>理解原理，也试着独立写一次。</strong>
        <p>掌握度由你判断，记录保存在当前浏览器中。</p>
      </div>
      <button
        class="button"
        :class="progress.mastered.includes(id) ? 'secondary' : 'primary'"
        :disabled="!isReady"
        :aria-pressed="progress.mastered.includes(id)"
        @click="progress.toggle(id)"
      >
        <AppIcon name="check" :size="18" />{{
          progress.mastered.includes(id) ? '已掌握 · 撤销标记' : '标记为已掌握'
        }}
      </button>
    </div>
  </template>
  <div v-else class="empty-state">
    <h1>模块不存在</h1>
    <RouterLink to="/">返回能力总览</RouterLink>
  </div>
</template>

<style scoped lang="scss">
.panel-code {
  height: 300px;
}
</style>
