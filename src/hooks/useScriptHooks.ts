export function useScript(src: string) {
  const loading = ref(false)
  const success = ref(false)
  const script: HTMLScriptElement = document.createElement('script')

  const promise = new Promise((resolve, reject) => {
    onMounted(() => {
      script.type = 'text/javascript'
      script.onload = function () {
        loading.value = true
        success.value = true
        resolve('')
      }

      script.onerror = function (err) {
        loading.value = false
        success.value = false
        reject(err)
      }

      script.src = src
      document.head.appendChild(script)
    })
  })

  onUnmounted(() => {
    script && script.remove()
  })

  return {
    loading,
    success,
    loadScript: () => promise,
  }
}
