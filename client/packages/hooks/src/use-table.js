import { computed, reactive, ref } from 'vue'

import useBoolean from './use-boolean'
import useLoading from './use-loading'

export default function useHookTable(config) {
  const { loading, startLoading, endLoading } = useLoading()
  const { bool: empty, setBool: setEmpty } = useBoolean()

  const { apiFn, apiParams, transformer, immediate = true, getColumnChecks, getColumns } = config

  const searchParams = reactive({ ...apiParams })

  const allColumns = ref(config.columns())

  const data = ref([])

  const columnChecks = ref(getColumnChecks(config.columns()))

  const columns = computed(() => getColumns(allColumns.value, columnChecks.value))

  function reloadColumns() {
    allColumns.value = config.columns()

    const checkMap = new Map(columnChecks.value.map((col) => [col.key, col.checked]))

    const defaultChecks = getColumnChecks(allColumns.value)

    columnChecks.value = defaultChecks.map((col) => ({
      ...col,
      checked: checkMap.get(col.key) ?? col.checked
    }))
  }

  async function getData() {
    startLoading()

    const formattedParams = formatSearchParams(searchParams)

    const response = await apiFn(formattedParams)

    const transformed = transformer(response)

    data.value = transformed.data

    setEmpty(transformed.data.length === 0)

    await config.onFetched?.(transformed)

    endLoading()
  }

  function formatSearchParams(params) {
    const formattedParams = {}

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formattedParams[key] = value
      }
    })

    return formattedParams
  }

  /**
   * update search params
   *
   * @param params
   */
  function updateSearchParams(params) {
    Object.assign(searchParams, params)
  }

  /** reset search params */
  function resetSearchParams() {
    Object.assign(searchParams, apiParams)
  }

  if (immediate) {
    getData()
  }

  return {
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
  }
}
