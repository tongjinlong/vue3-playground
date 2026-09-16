<script setup lang="ts">
import { useCodeEditor } from '@/composables/useCodeEditor'
import { useCodeRunner } from '@/composables/useCodeRunner'
import { ArrowDown } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'

interface LanguageOptions {
  value: string
  label: string
}

const source = defineModel<string>('source', { required: true })

const languageOptions: LanguageOptions[] = [
  { value: 'javascript', label: 'Javascript' },
  { value: 'typescript', label: 'Typescript' },
  { value: 'html', label: 'Html' },
  { value: 'Vue', label: 'vue' },
  { value: 'React', label: 'react' },
]

const selectedLanguage = ref<LanguageOptions>({ value: 'vue', label: 'Vue' })

const language = computed(() => selectedLanguage.value.value)

const { editorRef, reset, getCode } = useCodeEditor({
  code: source,
  language: language,
})

const { previewUrl, loading, run, error } = useCodeRunner()

// editorRef 通过模板中的 ref="editorRef" 使用。
void editorRef

const handleCommand = (value: string) => {
  const option = languageOptions.find((item) => item.value === value)

  if (option) {
    selectedLanguage.value = option
  }
}

async function handleRun() {
  const code = getCode()

  await run(code)
}
</script>
<template>
  <div class="code-container">
    <div class="preview">
      <div v-if="loading" class="preview-loading">正在初始化运行环境...</div>

      <div v-else-if="error" class="preview-error">
        {{ error }}
      </div>

      <iframe v-else-if="previewUrl" :src="previewUrl" class="preview-frame" />

      <div v-else class="preview-empty">点击运行查看效果</div>
    </div>
    <div class="code-head">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          {{ selectedLanguage.label }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in languageOptions"
              :key="item.value"
              :command="item.value"
            >
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div>
        <el-button size="small" v-on:click="handleRun" :disabled="loading">运行</el-button>
        <el-button size="small" v-on:click="reset">重置</el-button>
      </div>
    </div>
    <div class="code-editor" ref="editorRef"></div>
  </div>
</template>

<style lang="scss" scoped>
.code-container {
  min-height: 200px;

  .code-head {
    width: 100%;
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;

    .el-dropdown-link {
      display: flex;
      align-items: center;
    }
  }

  .code-editor {
    height: 300px;
  }
}

.preview {
  width: 100%;
  height: 100%;

  min-height: 500px;
}

.preview-frame {
  width: 100%;
  height: 100%;

  min-height: 500px;

  border: 0;
}

.preview-loading,
.preview-error,
.preview-empty {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: 500px;
}
</style>
