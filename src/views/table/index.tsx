import { NInput, NDataTable, NButton } from 'naive-ui'
import { setCache, getCache } from 'imba-cache'

export default defineComponent({
  setup() {
    const path = ref('E:\\')
    const log = ref('')

    const tableCol = [
      {
        type: 'selection',
        options: [
          'all',
          'none',
          {
            label: '选中前 2 行',
            key: 'f2',
            onSelect: (pageData) => {
              checkedRowKeys.value = pageData.map((row) => row.name).slice(0, 2)
            },
          },
        ],
        disabled(row) {
          return row.name === 'Edward King 3'
        },
      },
      {
        title: '目录名',
        key: 'name',
      },
    ] as any
    const tableData = ref<any[]>([])
    const checkedRowKeys = ref<string[]>([])

    onMounted(() => {
      const pathCache = getCache('dirPath') || ''
      if (pathCache) {
        path.value = pathCache
        getDir()
      }
    })

    ipcRenderOn('renderTest', (params) => {
      console.log('%c [ params ]-10', 'font-size:14px; background:#41b883; color:#ffffff;', params, Date.now())
      log.value += `${params.msg}\n`
    })

    const getDir = () => {
      const pathStr = toRaw(path.value)
      if (pathStr) setCache('dirPath', pathStr)
      ipcInvoke('dirList', { pathStr }).then((res) => {
        console.log('%c [ res ]-51', 'font-size:14px; background:#41b883; color:#ffffff;', res)
        tableData.value = res.map((value) => ({ name: value }))
      })

      // ipcService()
    }

    return () => (
      <>
        <div class="flex-center">
          <NInput v-model:value={path.value} clearable type="text" placeholder="项目目录" />
          <NButton onClick={getDir}>{{ default: () => '加载目录' }}</NButton>
        </div>
        <div class="h-auto min-h-80px w-100% bg-blue text-white">
          { checkedRowKeys.value.map((item) => `${item}，`) }
        </div>
        <div class="flex-center">
          <NDataTable
            columns={tableCol}
            data={tableData.value}
            maxHeight={500}
            rowKey={(row) => row.name}
            checkedRowKeys={checkedRowKeys.value}
            onUpdateCheckedRowKeys={(keys) => {
              checkedRowKeys.value = keys as string[]
            }}
          >

          </NDataTable>
          <NInput
            v-model:value={log.value}
            placeholder="日志信息..."
            type="textarea"
            autosize={
              {
                minRows: 3,
                maxRows: 5,
              }
            }
          />
        </div>
      </>
    )
  },
})
