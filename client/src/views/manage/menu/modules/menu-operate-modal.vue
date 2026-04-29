<script setup lang="jsx">
import { SimpleScrollbar } from '@sa/materials'
import { computed, nextTick, reactive, ref, watch } from 'vue'

import SvgIcon from '@/components/custom/svg-icon.vue'
import { enableStatusOptions, menuIconTypeOptions, menuTypeOptions } from '@/constants/business'
import { useAntdForm, useFormRules } from '@/hooks/common/form'
import { fetchGetAllRoles } from '@/service/api'
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
    add: '新增菜单',
    addChild: '新增子菜单',
    edit: '编辑菜单'
  }
  return titles[props.operateType]
})

const model = reactive(createDefaultModel())

function createDefaultModel() {
  return {
    menuType: '1',
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
    query: [],
    buttons: []
  }
}

const rules = {
  menuName: defaultRequiredRule,
  status: defaultRequiredRule,
  routeName: defaultRequiredRule,
  routePath: defaultRequiredRule
}

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

const showLayout = computed(() => model.parentId === 0)

const showPage = computed(() => model.menuType === '2')

const pageOptions = computed(() => {
  const allPages = [...props.allPages]

  if (model.routeName && !allPages.includes(model.routeName)) {
    allPages.unshift(model.routeName)
  }

  const opts = allPages.map((page) => ({
    label: page,
    value: page
  }))

  return opts
})

const layoutOptions = [
  {
    label: 'base',
    value: 'base'
  },
  {
    label: 'blank',
    value: 'blank'
  }
]

/** 可用角色选项 */
const roleOptions = ref([])

async function getRoleOptions() {
  const { error, data } = await fetchGetAllRoles()

  if (!error) {
    const options = data.map((item) => ({
      label: item.roleName,
      value: item.roleCode
    }))

    roleOptions.value = [...options]
  }
}

/** 新增一项路由参数 */
function addQuery(index) {
  model.query.splice(index + 1, 0, {
    key: '',
    value: ''
  })
}

/** 删除一项路由参数 */
function removeQuery(index) {
  model.query.splice(index, 1)
}

/** 新增一项按钮配置 */
function addButton(index) {
  model.buttons.splice(index + 1, 0, {
    code: '',
    desc: ''
  })
}

/** 删除一项按钮配置 */
function removeButton(index) {
  model.buttons.splice(index, 1)
}

async function handleInitModel() {
  Object.assign(model, createDefaultModel())

  if (!props.rowData) return

  await nextTick()

  if (props.operateType === 'addChild') {
    const { id } = props.rowData

    Object.assign(model, { parentId: id })
  }

  if (props.operateType === 'edit') {
    const { component, ...rest } = props.rowData

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
  if (!model.buttons) {
    model.buttons = []
  }
}

function closeDrawer() {
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
  const { layout, page, pathParam, ...params } = model

  const component = transformLayoutAndPageToComponent(layout, page)
  const routePath = getRoutePathWithParam(model.routePath, pathParam)

  params.component = component
  params.routePath = routePath

  return params
}

async function handleSubmit() {
  await validate()

  const params = getSubmitParams()

  console.log('提交参数: ', params)

  // 请求
  window.$message?.success('更新成功')
  closeDrawer()
  emit('submitted')
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel()
    resetFields()
    getRoleOptions()
  }
})

watch(
  () => model.routeName,
  () => {
    handleUpdateRoutePathByRouteName()
  }
)
</script>

<template>
  <AModal v-model:open="visible" :title="title" width="800px">
    <div class="h-480px">
      <SimpleScrollbar>
        <AForm ref="formRef" :model="model" :rules="rules" :label-col="{ lg: 8, xs: 4 }" label-wrap class="pr-20px">
          <ARow>
            <ACol :lg="12" :xs="24">
              <AFormItem :label="'菜单类型'" name="menuType">
                <ARadioGroup v-model:value="model.menuType" :disabled="disabledMenuType">
                  <ARadio v-for="item in menuTypeOptions" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </ARadio>
                </ARadioGroup>
              </AFormItem>
            </ACol>
            <ACol :lg="12" :xs="24">
              <AFormItem :label="'菜单名称'" name="menuName">
                <AInput v-model:value="model.menuName" :placeholder="'请输入菜单名称'" />
              </AFormItem>
            </ACol>
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
            <ACol :lg="12" :xs="24">
              <AFormItem v-if="showLayout" :label="'布局'" name="layout">
                <ASelect v-model:value="model.layout" :options="layoutOptions" :placeholder="'请选择布局组件'" />
              </AFormItem>
            </ACol>
            <ACol v-if="showPage" :lg="12" :xs="24">
              <AFormItem :label="'页面组件'" name="page">
                <ASelect v-model:value="model.page" :options="pageOptions" :placeholder="'请选择页面组件'" />
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
                  <ARadio v-for="item in menuIconTypeOptions" :key="item.value" :value="item.value">
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
                  <ASelect v-model:value="model.icon" :placeholder="'请选择本地图标'" :options="localIconOptions" />
                </template>
              </AFormItem>
            </ACol>
            <ACol :lg="12" :xs="24">
              <AFormItem :label="'菜单状态'" name="status">
                <ARadioGroup v-model:value="model.status">
                  <ARadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </ARadio>
                </ARadioGroup>
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
                  <ARadio value>
                    {{ '是' }}
                  </ARadio>
                  <ARadio :value="false">
                    {{ '否' }}
                  </ARadio>
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
                  <ARadio value :label="'是'" />
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
                <AButton v-if="model.query.length === 0" type="dashed" block @click="addQuery(-1)">
                  <template #icon>
                    <icon-carbon-add class="align-sub text-icon" />
                  </template>
                  <span class="ml-8px">{{ '新增' }}</span>
                </AButton>
                <template v-else>
                  <div v-for="(item, index) in model.query" :key="index" class="flex gap-3">
                    <ACol :span="9">
                      <AFormItem :name="['query', index, 'key']">
                        <AInput v-model:value="item.key" :placeholder="'请输入路由参数键'" class="flex-1" />
                      </AFormItem>
                    </ACol>
                    <ACol :span="9">
                      <AFormItem :name="['query', index, 'value']">
                        <AInput v-model:value="item.value" :placeholder="'请输入路由参数值'" class="flex-1" />
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
            <ACol :span="24">
              <AFormItem :label-col="{ span: 4 }" :label="'按钮'" name="buttons">
                <AButton v-if="model.buttons.length === 0" type="dashed" block @click="addButton(-1)">
                  <template #icon>
                    <icon-carbon-add class="align-sub text-icon" />
                  </template>
                  <span class="ml-8px">{{ '新增' }}</span>
                </AButton>
                <template v-else>
                  <div v-for="(item, index) in model.buttons" :key="index" class="flex gap-3">
                    <ACol :span="9">
                      <AFormItem :name="['buttons', index, 'code']">
                        <AInput v-model:value="item.code" :placeholder="'请输入按钮编码'" class="flex-1"></AInput>
                      </AFormItem>
                    </ACol>
                    <ACol :span="9">
                      <AFormItem :name="['buttons', index, 'desc']">
                        <AInput v-model:value="item.desc" :placeholder="'请输入按钮描述'" class="flex-1"></AInput>
                      </AFormItem>
                    </ACol>
                    <ACol :span="5">
                      <ASpace class="ml-12px">
                        <AButton size="middle" @click="addButton(index)">
                          <template #icon>
                            <icon-ic:round-plus class="align-sub text-icon" />
                          </template>
                        </AButton>
                        <AButton size="middle" @click="removeButton(index)">
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
          </ARow>
        </AForm>
      </SimpleScrollbar>
    </div>
    <template #footer>
      <ASpace justify="end" :size="16">
        <AButton @click="closeDrawer">{{ '取消' }}</AButton>
        <AButton type="primary" @click="handleSubmit">{{ '确认' }}</AButton>
      </ASpace>
    </template>
  </AModal>
</template>

<style scoped></style>
