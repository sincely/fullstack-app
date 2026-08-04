<script setup lang="jsx">
import { SimpleScrollbar } from '@sa/materials'
import { computed, nextTick, reactive, watch } from 'vue'

import SvgIcon from '@/components/custom/svg-icon.vue'
import { enableStatusOptions, menuIconTypeOptions, menuTypeOptions } from '@/constants/business'
import { useAntdForm, useFormRules } from '@/hooks/common/form'
import { fetchCreateMenu, fetchUpdateMenu } from '@/service/api'
import { getLocalIcons } from '@/utils/icon'

import {
  getLayoutAndPage,
  getPathParamFromRoutePath,
  getRoutePathByRouteName,
  getRoutePathWithParam,
  transformLayoutAndPageToComponent
} from './shared'

defineOptions({
  name: 'MenuOperateModal'
})

const props = defineProps({
  operateType: {
    type: String,
    required: true
  },
  rowData: {
    type: Object,
    default: null
  },
  allPages: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['submitted'])

const visible = defineModel('visible', {
  default: false
})

const { formRef, validate, resetFields } = useAntdForm()
const { defaultRequiredRule } = useFormRules()

const title = computed(() => {
  const titles = {
    add: '新增',
    addChild: '新增',
    edit: '编辑' + (props.rowData?.menuType === '3' ? '按钮' : '菜单')
  }
  return titles[props.operateType]
})

const model = reactive(createDefaultModel())

function createDefaultModel() {
  return {
    menuType: '2',
    menuName: '',
    routeName: '',
    routePath: '',
    pathParam: '',
    component: '',
    layout: '',
    page: '',
    icon: '',
    iconType: '1',
    parentId: 0,
    status: '1',
    keepAlive: false,
    constant: false,
    order: 0,
    href: null,
    hideInMenu: false,
    activeMenu: null,
    multiTab: false,
    fixedIndexInTab: null,
    query: []
  }
}

const rules = computed(() => {
  const base = {
    menuName: defaultRequiredRule,
    status: defaultRequiredRule
  }
  if (model.menuType === '3') {
    base.routeName = defaultRequiredRule
  } else {
    base.routeName = defaultRequiredRule
    base.routePath = defaultRequiredRule
  }
  return base
})

const showLayout = computed(() => model.parentId === 0)
const showPage = computed(() => model.menuType === '2')
const isButton = computed(() => model.menuType === '3')

const disabledMenuType = computed(() => props.operateType === 'edit')

const localIcons = getLocalIcons()
const localIconOptions = localIcons.map((item) => ({
  label: () => (
    <div class="flex-y-center gap-16px">
      <SvgIcon localIcon={item} class="text-icon" />
      <span>{item}</span>
    </div>
  ),
  value: item
}))

const pageOptions = computed(() => {
  const allPages = [...props.allPages]

  if (model.routeName && !allPages.some((item) => item.name === model.routeName)) {
    allPages.unshift({
      name: model.routeName,
      label: model.menuName || model.routeName
    })
  }

  const opts = allPages.map((page) => ({
    label: page.label ? `${page.label} (${page.name})` : page.name,
    value: page.name
  }))

  return opts
})

const layoutOptions = [
  { label: 'base', value: 'base' },
  { label: 'blank', value: 'blank' }
]

function addQuery(index) {
  model.query.splice(index + 1, 0, { key: '', value: '' })
}

function removeQuery(index) {
  model.query.splice(index, 1)
}

async function handleInitModel() {
  Object.assign(model, createDefaultModel())

  if (!props.rowData) return

  await nextTick()

  if (props.operateType === 'addChild') {
    const { id, menuType } = props.rowData
    const defaultType = menuType === '2' ? '3' : '2'
    Object.assign(model, { parentId: id, menuType: defaultType })
    return
  }

  if (props.operateType === 'edit') {
    const { component, buttons, ...rest } = props.rowData

    const { layout, page } = getLayoutAndPage(component)
    const { path, param } = getPathParamFromRoutePath(rest.routePath)

    Object.assign(model, rest, {
      layout,
      page,
      routePath: path,
      pathParam: param
    })
  }

  if (!model.query) {
    model.query = []
  }
}

function closeModal() {
  visible.value = false
}

function handleUpdateRoutePathByRouteName() {
  if (model.routeName) {
    model.routePath = getRoutePathByRouteName(model.routeName)
  } else {
    model.routePath = ''
  }
}

function getSubmitParams() {
  const { layout, page, pathParam, order, constant, href, query, fixedIndexInTab, ...params } = model

  if (isButton.value) {
    const { layout: _l, page: _p, pathParam: _pp, constant: _c, href: _h, query: _q, fixedIndexInTab: _f, icon: _i, iconType: _it, component: _cm, routePath: _rp, keepAlive: _k, hideInMenu: _hm, activeMenu: _am, multiTab: _mt, ...rest } = model
    return {
      ...rest,
      routeName: model.routeName || model.menuName,
      routePath: '',
      orderNum: Number(order || 0),
      parentId: Number(model.parentId || 0),
      menuType: 3
    }
  }

  const component = transformLayoutAndPageToComponent(layout, page)
  const routePath = getRoutePathWithParam(model.routePath, pathParam)

  params.component = component || null
  params.routePath = routePath
  params.orderNum = Number(order || 0)
  params.parentId = Number(model.parentId || 0)
  params.menuType = Number(model.menuType)
  params.iconType = Number(model.iconType)

  return params
}

async function handleSubmit() {
  await validate()

  const params = getSubmitParams()
  const submitApi = props.operateType === 'edit' ? fetchUpdateMenu : fetchCreateMenu
  const submitParams = props.operateType === 'edit' ? { ...params, id: props.rowData.id } : params
  const { error } = await submitApi(submitParams)

  if (error) {
    return
  }

  window.$message?.success(props.operateType === 'edit' ? '更新成功' : '创建成功')
  closeModal()
  emit('submitted')
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel()
    resetFields()
  }
})

watch(
  () => model.routeName,
  () => {
    if (!isButton.value) {
      handleUpdateRoutePathByRouteName()
    }
  }
)
</script>

<template>
  <a-modal v-model:open="visible" :title="title" width="800px">
    <div class="h-480px">
      <SimpleScrollbar>
        <a-form
          ref="formRef"
          :model="model"
          :rules="rules"
          :label-col="{ lg: 8, xs: 4 }"
          label-wrap
          class="pr-20px"
        >
          <a-row>
            <!-- 菜单类型 -->
            <a-col :lg="12" :xs="24">
              <a-form-item :label="'菜单类型'" name="menuType">
                <a-radio-group
                  v-model:value="model.menuType"
                  :disabled="disabledMenuType"
                >
                  <a-radio v-for="item in menuTypeOptions" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>

            <!-- 名称：按钮名称 / 菜单名称 -->
            <a-col :lg="12" :xs="24">
              <a-form-item :label="isButton ? '权限名称' : '菜单名称'" name="menuName">
                <a-input
                  v-model:value="model.menuName"
                  :placeholder="isButton ? '请输入权限名称，如新增' : '请输入菜单名称'"
                />
              </a-form-item>
            </a-col>

            <!-- ====== 按钮类型字段 ====== -->
            <template v-if="isButton">
              <a-col :lg="12" :xs="24">
                <a-form-item :label="'权限标识'" name="routeName">
                  <a-input v-model:value="model.routeName" :placeholder="'请输入权限标识，如 add'" />
                </a-form-item>
              </a-col>

              <a-col :lg="12" :xs="24">
                <a-form-item :label="'排序'" name="order">
                  <a-input-number v-model:value="model.order" class="w-full" :placeholder="'请输入排序'" />
                </a-form-item>
              </a-col>

              <a-col :lg="12" :xs="24">
                <a-form-item :label="'是否启用'" name="status">
                  <a-radio-group v-model:value="model.status">
                    <a-radio
                      v-for="item in enableStatusOptions"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </template>

            <!-- ====== 目录/菜单类型字段 ====== -->
            <template v-if="!isButton">
              <a-col :lg="12" :xs="24">
                <a-form-item :label="'路由名称'" name="routeName">
                  <a-input v-model:value="model.routeName" :placeholder="'请输入路由名称'" />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="'路由路径'" name="routePath">
                  <a-input v-model:value="model.routePath" disabled :placeholder="'请输入路由路径'" />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="'路径参数'" name="pathParam">
                  <a-input v-model:value="model.pathParam" :placeholder="'请输入路径参数'" />
                </a-form-item>
              </a-col>
              <a-col v-if="showLayout" :lg="12" :xs="24">
                <a-form-item :label="'布局'" name="layout">
                  <a-select
                    v-model:value="model.layout"
                    :options="layoutOptions"
                    :placeholder="'请选择布局组件'"
                  />
                </a-form-item>
              </a-col>
              <a-col v-if="showPage" :lg="12" :xs="24">
                <a-form-item :label="'页面组件'" name="page">
                  <a-select
                    v-model:value="model.page"
                    :options="pageOptions"
                    :placeholder="'请选择页面组件'"
                  />
                </a-form-item>
              </a-col>

              <a-col :lg="12" :xs="24">
                <a-form-item :label="'排序'" name="order">
                  <a-input-number v-model:value="model.order" class="w-full" :placeholder="'请输入排序'" />
                </a-form-item>
              </a-col>

              <a-col :lg="12" :xs="24">
                <a-form-item :label="'图标类型'" name="iconType">
                  <a-radio-group v-model:value="model.iconType">
                    <a-radio
                      v-for="item in menuIconTypeOptions"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="'图标'" name="icon">
                  <template v-if="model.iconType === '1'">
                    <a-input v-model:value="model.icon" :placeholder="'请输入图标'" class="flex-1">
                      <template #suffix>
                        <SvgIcon v-if="model.icon" :icon="model.icon" class="text-icon" />
                      </template>
                    </a-input>
                  </template>
                  <template v-if="model.iconType === '2'">
                    <a-select
                      v-model:value="model.icon"
                      :placeholder="'请选择本地图标'"
                      :options="localIconOptions"
                    />
                  </template>
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="'缓存路由'" name="keepAlive">
                  <a-radio-group v-model:value="model.keepAlive">
                    <a-radio :value="true">{{ '是' }}</a-radio>
                    <a-radio :value="false">{{ '否' }}</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="'常量路由'" name="constant">
                  <a-radio-group v-model:value="model.constant">
                    <a-radio :value="true">{{ '是' }}</a-radio>
                    <a-radio :value="false">{{ '否' }}</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="'外链'" name="href">
                  <a-input v-model:value="model.href" :placeholder="'请输入外链'" />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="'隐藏菜单'" name="hideInMenu">
                  <a-radio-group v-model:value="model.hideInMenu">
                    <a-radio :value="true">{{ '是' }}</a-radio>
                    <a-radio :value="false">{{ '否' }}</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col v-if="model.hideInMenu" :lg="12" :xs="24">
                <a-form-item :label="'高亮的菜单'" name="activeMenu">
                  <a-select
                    v-model:value="model.activeMenu"
                    :options="pageOptions"
                    clearable
                    :placeholder="'请输入高亮的菜单的路由名称'"
                  />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="'支持多页签'" name="multiTab">
                  <a-radio-group v-model:value="model.multiTab">
                    <a-radio :value="true" :label="'是'" />
                    <a-radio :value="false" :label="'否'" />
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="'固定在页签中的序号'" name="fixedIndexInTab">
                  <a-input-number
                    v-model:value="model.fixedIndexInTab"
                    class="w-full"
                    clearable
                    :placeholder="'请输入固定在页签中的序号'"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item :label-col="{ span: 4 }" :label="'路由参数'" name="query">
                  <a-button
                    v-if="model.query.length === 0"
                    type="dashed"
                    block
                    @click="addQuery(-1)"
                  >
                    <template #icon>
                      <icon-carbon-add class="align-sub text-icon" />
                    </template>
                    <span class="ml-8px">{{ '新增' }}</span>
                  </a-button>
                  <template v-else>
                    <div
                      v-for="(item, index) in model.query"
                      :key="index"
                      class="flex gap-3"
                    >
                      <a-col :span="9">
                        <a-form-item :name="['query', index, 'key']">
                          <a-input
                            v-model:value="item.key"
                            :placeholder="'请输入路由参数键'"
                            class="flex-1"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :span="9">
                        <a-form-item :name="['query', index, 'value']">
                          <a-input
                            v-model:value="item.value"
                            :placeholder="'请输入路由参数值'"
                            class="flex-1"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :span="5">
                        <a-space class="ml-12px">
                          <a-button size="middle" @click="addQuery(index)">
                            <template #icon>
                              <icon-ic:round-plus class="align-sub text-icon" />
                            </template>
                          </a-button>
                          <a-button size="middle" @click="removeQuery(index)">
                            <template #icon>
                              <icon-ic-round-remove class="align-sub text-icon" />
                            </template>
                          </a-button>
                        </a-space>
                      </a-col>
                    </div>
                  </template>
                </a-form-item>
              </a-col>

              <a-col :lg="12" :xs="24">
                <a-form-item :label="'状态'" name="status">
                  <a-radio-group v-model:value="model.status">
                    <a-radio
                      v-for="item in enableStatusOptions"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </template>
          </a-row>
        </a-form>
      </SimpleScrollbar>
    </div>
    <template #footer>
      <a-space justify="end" :size="16">
        <a-button @click="closeModal">{{ '取消' }}</a-button>
        <a-button type="primary" @click="handleSubmit">{{ '确认' }}</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<style scoped></style>
