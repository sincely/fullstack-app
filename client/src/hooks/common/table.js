import { useBoolean, useHookTable } from '@sa/hooks'
import { jsonClone } from '@sa/utils'
import { useElementSize } from '@vueuse/core'
import { computed, reactive, ref, shallowRef, toValue } from 'vue'

import { useAppStore } from '@/store/modules/app'

export function useTable(config) {
  const appStore = useAppStore()
  const { apiFn, apiParams, immediate } = config

  const {
    loading,
    empty,
    data,
    columns,
    columnChecks,
    reloadColumns,
    getData,
    searchParams,
    updateSearchParams,
    resetSearchParams
  } = useHookTable({
    apiFn,
    apiParams,
    columns: config.columns,
    transformer: (res) => {
      const { records = [], current = 1, size = 10, total = 0 } = res.data || {}

      // Ensure that the size is greater than 0, If it is less than 0, it will cause paging calculation errors.
      const pageSize = size <= 0 ? 10 : size

      const recordsWithIndex = records.map((item, index) => {
        return {
          ...item,
          index: (current - 1) * pageSize + index + 1
        }
      })

      return {
        data: recordsWithIndex,
        pageNum: current,
        pageSize,
        total
      }
    },
    getColumnChecks: (cols) => {
      const checks = []

      cols.forEach((column) => {
        if (column.key) {
          checks.push({
            key: column.key,
            title: column.title,
            checked: true
          })
        }
      })

      return checks
    },
    getColumns: (cols, checks) => {
      const columnMap = new Map()

      cols.forEach((column) => {
        if (column.key) {
          columnMap.set(column.key, column)
        }
      })

      const filteredColumns = checks.filter((item) => item.checked).map((check) => columnMap.get(check.key))

      return filteredColumns
    },
    onFetched: async (transformed) => {
      const { pageNum, pageSize, total } = transformed

      updatePagination({
        current: pageNum,
        pageSize,
        total
      })
    },
    immediate
  })

  const pagination = reactive({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '15', '20', '25', '30'],
    total: 0,
    onChange: async (current, size) => {
      pagination.current = current

      updateSearchParams({
        current,
        size
      })

      getData()
    }
  })

  // this is for mobile, if the system does not support mobile, you can use `pagination` directly
  const mobilePagination = computed(() => {
    const p = {
      ...pagination,
      simple: appStore.isMobile
    }

    return p
  })

  function updatePagination(update) {
    Object.assign(pagination, update)
  }

  /**
   * get data by page number
   *
   * @param pageNum the page number. default is 1
   */
  async function getDataByPage(pageNum = 1) {
    updatePagination({
      current: pageNum
    })

    updateSearchParams({
      current: pageNum,
      size: pagination.pageSize
    })

    await getData()
  }

  return {
    loading,
    empty,
    data,
    columns,
    columnChecks,
    reloadColumns,
    pagination,
    mobilePagination,
    updatePagination,
    getData,
    getDataByPage,
    searchParams,
    updateSearchParams,
    resetSearchParams
  }
}

export function useTableOperate(data, getData) {
  const { bool: drawerVisible, setTrue: openDrawer, setFalse: closeDrawer } = useBoolean()

  const operateType = ref('add')

  function handleAdd() {
    operateType.value = 'add'
    openDrawer()
  }

  /** the editing row data */
  const editingData = ref(null)

  function handleEdit(id) {
    operateType.value = 'edit'
    const findItem = data.value.find((item) => item.id === id) || null
    editingData.value = jsonClone(findItem)

    openDrawer()
  }

  /** the checked row keys of table */
  const checkedRowKeys = ref([])

  function onSelectChange(keys) {
    checkedRowKeys.value = keys
  }

  const rowSelection = computed(() => {
    return {
      columnWidth: 48,
      type: 'checkbox',
      selectedRowKeys: checkedRowKeys.value,
      onChange: onSelectChange
    }
  })

  /** the hook after the batch delete operation is completed */
  async function onBatchDeleted() {
    window.$message?.success('删除成功')

    checkedRowKeys.value = []

    await getData()
  }

  /** the hook after the delete operation is completed */
  async function onDeleted() {
    window.$message?.success('删除成功')

    await getData()
  }

  return {
    drawerVisible,
    openDrawer,
    closeDrawer,
    operateType,
    handleAdd,
    editingData,
    handleEdit,
    checkedRowKeys,
    onSelectChange,
    rowSelection,
    onBatchDeleted,
    onDeleted
  }
}

export function useTableScroll(scrollX = 702) {
  const tableWrapperRef = shallowRef(null)
  const { height: wrapperElHeight } = useElementSize(tableWrapperRef)

  const scrollConfig = computed(() => {
    return {
      y: wrapperElHeight.value - 72,
      x: toValue(scrollX)
    }
  })

  return {
    tableWrapperRef,
    scrollConfig
  }
}
