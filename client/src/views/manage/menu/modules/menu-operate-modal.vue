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
  <AModal v-model:open="visible" :title="title" width="800px">
    <div class="h-480px">
      <SimpleScrollbar>
        <AForm
          ref="formRef"
          :model="model"
          :rules="rules"
          :label-col="{ lg: 8, xs: 4 }"
          label-wrap
          class="pr-20px"
        >
          <ARow>
            <!-- 菜单类型 -->
            <ACol :lg="12" :xs="24">
              <AFormItem :label="'菜单类型'" name="menuType">
                <ARadioGroup
                  v-model:value="model.menuType"
                  :disabled="disabledMenuType"
                >
                  <ARadio v-for="item in menuTypeOptions" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </ARadio>
                </ARadioGroup>
              </AFormItem>
            </ACol>

            <!-- 名称：按钮名称 / 菜单名称 -->
            <ACol :lg="12" :xs="24">
              <AFormItem :label="isButton ? '权限名称' : '菜单名称'" name="menuName">
                <AInput
                  v-model:value="model.menuName"
                  :placeholder="isButton ? '请输入权限名称，如新增' : '请输入菜单名称'"
                />
              </AFormItem>
            </ACol>

            <!-- ====== 按钮类型字段 ====== -->
            <template v-if="isButton">
              <ACol :lg="12" :xs="24">
                <AFormItem :label="'权限标识'" name="routeName">
                  <AInput v-model:value="model.routeName" :placeholder="'请输入权限标识，如 add'" />
                </AFormItem>
              </ACol>

              <ACol :lg="12" :xs="24">
                <AFormItem :label="'排序'" name="order">
                  <AInputNumber v-model:value="model.order" class="w-full" :placeholder="'请输入排序'" />
                </AFormItem>
              </ACol>

              <ACol :lg="12" :xs="24">
                <AFormItem :label="'是否启用'" name="status">
                  <ARadioGroup v-model:value="model.status">
                    <ARadio
                      v-for="item in enableStatusOptions"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </ARadio>
                  </ARadioGroup>
                </AFormItem>
              </ACol>
            </template>

            <!-- ====== 目录/菜单类型字段 ====== -->
            <template v-if="!isButton">
              <ACol :lg="12" :xs="24">
                <AFormItem :label="'路由名称'" name="routeName">
                  <AInput v-model:value="model.routeName" :placeholder="'请输入路由名称'" />
                </AFormItem>
              </ACol>
              <ACol :lg="12" :xs="24">
                <AFormItem :label="'路由路径'" name="routePath">
                  <AInput v-model:value="model.routePath" disabled :placeholder="'请输入路由路径'" />
                </AFormItem>
              </ACol>
              <ACol :lg="12" :xs="24">
                <AFormItem :label="'路径参数'" name="pathParam">
                  <AInput v-model:value="model.pathParam" :placeholder="'请输入路径参数'" />
                </AFormItem>
              </ACol>
              <ACol v-if="showLayout" :lg="12" :xs="24">
                <AFormItem :label="'布局'" name="layout">
                  <ASelect
                    v-model:value="model.layout"
                    :options="layoutOptions"
                    :placeholder="'请选择布局组件'"
                  />
                </AFormItem>
              </ACol>
              <ACol v-if="showPage" :lg="12" :xs="24">
                <AFormItem :label="'页面组件'" name="page">
                  <ASelect
                    v-model:value="model.page"
                    :options="pageOptions"
                    :placeholder="'请选择页面组件'"
                  />
                </AFormItem>
              </ACol>

              <ACol :lg="12" :xs="24">
                <AFormItem :label="'排序'" name="order">
                  <AInputNumber v-model:value="model.order" class="w-full" :placeholder="'请输入排序'" />
                </AFormItem>
              </ACol>

              <ACol :lg="12" :xs="24">
                <AFormItem :label="'图标类型'" name="iconType">
                  <ARadioGroup v-model:value="model.iconType">
                    <ARadio
                      v-for="item in menuIconTypeOptions"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </ARadio>
                  </ARadioGroup>
                </AFormItem>
              </ACol>
              <ACol :lg="12" :xs="24">
                <AFormItem :label="'图标'" name="icon">
                  <template v-if="model.iconType === '1'">
                    <AInput v-model:value="model.icon" :placeholder="'请输入图标'" class="flex-1">
                      <template #suffix>
                        <SvgIcon v-if="model.icon" :icon="model.icon" class="text-icon" />
                      </template>
                    </AInput>
                  </template>
                  <template v-if="model.iconType === '2'">
                    <ASelect
                      v-model:value="model.icon"
                      :placeholder="'请选择本地图标'"
                      :options="localIconOptions"
                    />
                  </template>
                </AFormItem>
              </ACol>
              <ACol :lg="12" :xs="24">
                <AFormItem :label="'缓存路由'" name="keepAlive">
                  <ARadioGroup v-model:value="model.keepAlive">
                    <ARadio :value="true">{{ '是' }}</ARadio>
                    <ARadio :value="false">{{ '否' }}</ARadio>
                  </ARadioGroup>
                </AFormItem>
              </ACol>
              <ACol :lg="12" :xs="24">
                <AFormItem :label="'常量路由'" name="constant">
                  <ARadioGroup v-model:value="model.constant">
                    <ARadio :value="true">{{ '是' }}</ARadio>
                    <ARadio :value="false">{{ '否' }}</ARadio>
                  </ARadioGroup>
                </AFormItem>
              </ACol>
              <ACol :lg="12" :xs="24">
                <AFormItem :label="'外链'" name="href">
                  <AInput v-model:value="model.href" :placeholder="'请输入外链'" />
                </AFormItem>
              </ACol>
              <ACol :lg="12" :xs="24">
                <AFormItem :label="'隐藏菜单'" name="hideInMenu">
                  <ARadioGroup v-model:value="model.hideInMenu">
                    <ARadio :value="true">{{ '是' }}</ARadio>
                    <ARadio :value="false">{{ '否' }}</ARadio>
                  </ARadioGroup>
                </AFormItem>
              </ACol>
              <ACol v-if="model.hideInMenu" :lg="12" :xs="24">
                <AFormItem :label="'高亮的菜单'" name="activeMenu">
                  <ASelect
                    v-model:value="model.activeMenu"
                    :options="pageOptions"
                    clearable
                    :placeholder="'请输入高亮的菜单的路由名称'"
                  />
                </AFormItem>
              </ACol>
              <ACol :lg="12" :xs="24">
                <AFormItem :label="'支持多页签'" name="multiTab">
                  <ARadioGroup v-model:value="model.multiTab">
                    <ARadio :value="true" :label="'是'" />
                    <ARadio :value="false" :label="'否'" />
                  </ARadioGroup>
                </AFormItem>
              </ACol>
              <ACol :lg="12" :xs="24">
                <AFormItem :label="'固定在页签中的序号'" name="fixedIndexInTab">
                  <AInputNumber
                    v-model:value="model.fixedIndexInTab"
                    class="w-full"
                    clearable
                    :placeholder="'请输入固定在页签中的序号'"
                  />
                </AFormItem>
              </ACol>
              <ACol :span="24">
                <AFormItem :label-col="{ span: 4 }" :label="'路由参数'" name="query">
                  <AButton
                    v-if="model.query.length === 0"
                    type="dashed"
                    block
                    @click="addQuery(-1)"
                  >
                    <template #icon>
                      <icon-carbon-add class="align-sub text-icon" />
                    </template>
                    <span class="ml-8px">{{ '新增' }}</span>
                  </AButton>
                  <template v-else>
                    <div
                      v-for="(item, index) in model.query"
                      :key="index"
                      class="flex gap-3"
                    >
                      <ACol :span="9">
                        <AFormItem :name="['query', index, 'key']">
                          <AInput
                            v-model:value="item.key"
                            :placeholder="'请输入路由参数键'"
                            class="flex-1"
                          />
                        </AFormItem>
                      </ACol>
                      <ACol :span="9">
                        <AFormItem :name="['query', index, 'value']">
                          <AInput
                            v-model:value="item.value"
                            :placeholder="'请输入路由参数值'"
                            class="flex-1"
                          />
                        </AFormItem>
                      </ACol>
                      <ACol :span="5">
                        <ASpace class="ml-12px">
                          <AButton size="middle" @click="addQuery(index)">
                            <template #icon>
                              <icon-ic:round-plus class="align-sub text-icon" />
                            </template>
                          </AButton>
                          <AButton size="middle" @click="removeQuery(index)">
                            <template #icon>
                              <icon-ic-round-remove class="align-sub text-icon" />
                            </template>
                          </AButton>
                        </ASpace>
                      </ACol>
                    </div>
                  </template>
                </AFormItem>
              </ACol>

              <ACol :lg="12" :xs="24">
                <AFormItem :label="'状态'" name="status">
                  <ARadioGroup v-model:value="model.status">
                    <ARadio
                      v-for="item in enableStatusOptions"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </ARadio>
                  </ARadioGroup>
                </AFormItem>
              </ACol>
            </template>
          </ARow>
        </AForm>
      </SimpleScrollbar>
    </div>
    <template #footer>
      <ASpace justify="end" :size="16">
        <AButton @click="closeModal">{{ '取消' }}</AButton>
        <AButton type="primary" @click="handleSubmit">{{ '确认' }}</AButton>
      </ASpace>
    </template>
  </AModal>
</template>

<style scoped></style>
