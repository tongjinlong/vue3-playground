import { ref } from 'vue'

import type { WebContainer, WebContainerProcess } from '@webcontainer/api'

import { createVueProject } from '@/playground/createVueProject'
import { getWebContainer } from '@/playground/webContainer'

export function useCodeRunner() {
  const previewUrl = ref('')

  const loading = ref(false)

  const initialized = ref(false)

  const error = ref('')

  let webContainer: WebContainer | null = null

  let devProcess: WebContainerProcess | null = null

  /**
   * 运行代码
   */
  async function run(code: string) {
    error.value = ''

    /**
     * 第一次运行
     */
    if (!initialized.value) {
      await initialize(code)

      return
    }

    if (!webContainer) return

    /**
     * 后续运行只更新 App.vue
     *
     * Vite 会自动 HMR
     */
    await webContainer.fs.writeFile('/src/App.vue', code)
  }

  /**
   * 初始化 WebContainer
   */
  async function initialize(code: string) {
    loading.value = true
    error.value = ''

    console.log('[runner] loading start:', loading.value)

    try {
      /**
       * 1. WebContainer
       */
      webContainer = await getWebContainer()

      console.log('[runner] boot success')

      /**
       * 2. 挂载 Vue 项目
       */
      await webContainer.mount(createVueProject(code))

      console.log('[runner] mount success')

      /**
       * 3. npm install
       */
      await installDependencies()

      console.log('[runner] install success')

      /**
       * 4. 启动 Vite
       */
      await startDevServer()

      console.log('[runner] startDevServer finished')

      initialized.value = true

      console.log('[runner] initialized:', initialized.value)
    } catch (err) {
      console.error('[runner error]', err)

      error.value = err instanceof Error ? err.message : '运行失败'
    } finally {
      loading.value = false

      console.log('[runner] loading end:', loading.value)
    }
  }

  /**
   * 安装依赖
   */
  async function installDependencies() {
    if (!webContainer) {
      throw new Error('WebContainer 尚未初始化')
    }

    const process = await webContainer.spawn('npm', ['install'])

    /**
     * 读取 npm 输出
     *
     * 不需要 await pipeTo
     * 我们真正等待的是 process.exit
     */
    void process.output
      .pipeTo(
        new WritableStream({
          write(data) {
            console.log('[npm]', data)
          },
        }),
      )
      .catch((err) => {
        console.error('[npm output error]', err)
      })

    /**
     * npm install 是一次性任务
     * 所以这里可以等待它退出
     */
    const exitCode = await process.exit

    if (exitCode !== 0) {
      throw new Error('npm install 失败')
    }
  }

  /**
   * 启动 Vite
   */
  async function startDevServer() {
    if (!webContainer) {
      throw new Error('WebContainer 尚未初始化')
    }

    console.log('[runner] start vite')

    /**
     * 先监听 server-ready
     */
    const serverReady = new Promise<string>((resolve) => {
      const unsubscribe = webContainer!.on(
        'server-ready',

        (port, url) => {
          console.log('[runner] server-ready', port, url)

          previewUrl.value = url

          /**
           * Promise 完成
           */
          resolve(url)

          /**
           * 已经拿到地址，不再继续监听
           */
          unsubscribe()
        },
      )
    })

    /**
     * 启动 Vite
     */
    devProcess = await webContainer.spawn('npm', ['run', 'dev'])

    /**
     * 关键：
     *
     * 不要 await！
     *
     * Vite 是长期运行进程，
     * output 不会正常结束。
     */
    void devProcess.output
      .pipeTo(
        new WritableStream({
          write(data) {
            console.log('[vite]', data)
          },
        }),
      )
      .catch((err) => {
        console.error('[vite output error]', err)
      })

    console.log('[runner] waiting server-ready')

    /**
     * 真正等待的是 Vite Server Ready
     */
    const url = await serverReady

    console.log('[runner] server promise resolved:', url)
  }

  return {
    previewUrl,

    loading,

    initialized,

    error,

    run,
  }
}
