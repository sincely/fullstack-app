<script setup>
import pkg from '~/package.json'

const { name, version, dependencies, devDependencies } = pkg

function transformVersionData(tuple) {
  const [$name, $version] = tuple
  return {
    name: $name,
    version: $version
  }
}

const pkgJson = {
  name,
  version,
  dependencies: Object.entries(dependencies).map((item) => transformVersionData(item)),
  devDependencies: Object.entries(devDependencies).map((item) => transformVersionData(item))
}

const latestBuildTime = BUILD_TIME
</script>

<template>
  <ASpace direction="vertical" :size="16">
    <ACard :title="'关于'" :bordered="false" size="small" class="card-wrapper">
      <p>
        {{
          'SoybeanAdmin 是一个优雅且功能强大的后台管理模板，基于最新的前端技术栈，包括 Vue3, Vite5, TypeScript, Pinia 和 UnoCSS。它内置了丰富的主题配置和组件，代码规范严谨，实现了自动化的文件路由系统。此外，它还采用了基于 ApiFox 的在线Mock数据方案。SoybeanAdmin 为您提供了一站式的后台管理解决方案，无需额外配置，开箱即用。同样是一个快速学习前沿技术的最佳实践。'
        }}
      </p>
    </ACard>
    <ACard :title="'项目信息'" :bordered="false" size="small" class="card-wrapper">
      <ADescriptions label-placement="left" bordered size="small" :column="{ xs: 1, sm: 2 }">
        <ADescriptionsItem :label="'版本'">
          <ATag color="blue">{{ pkgJson.version }}</ATag>
        </ADescriptionsItem>
        <ADescriptionsItem :label="'最新构建时间'">
          <ATag color="blue">{{ latestBuildTime }}</ATag>
        </ADescriptionsItem>
        <ADescriptionsItem :label="'Github 地址'">
          <a class="text-primary" :href="pkg.homepage" target="_blank" rel="noopener noreferrer">
            {{ 'Github 地址' }}
          </a>
        </ADescriptionsItem>
        <ADescriptionsItem :label="'预览地址'">
          <a class="text-primary" :href="pkg.website" target="_blank" rel="noopener noreferrer">
            {{ '预览地址' }}
          </a>
        </ADescriptionsItem>
      </ADescriptions>
    </ACard>
    <ACard :title="'生产依赖'" :bordered="false" size="small" class="card-wrapper">
      <ADescriptions label-placement="left" bordered size="small" :column="{ xs: 1, sm: 2 }">
        <ADescriptionsItem v-for="item in pkgJson.dependencies" :key="item.name" :label="item.name">
          {{ item.version }}
        </ADescriptionsItem>
      </ADescriptions>
    </ACard>
    <ACard :title="'开发依赖'" :bordered="false" size="small" class="card-wrapper">
      <ADescriptions label-placement="left" bordered size="small" :column="{ xs: 1, sm: 2 }">
        <ADescriptionsItem v-for="item in pkgJson.devDependencies" :key="item.name" :label="item.name">
          {{ item.version }}
        </ADescriptionsItem>
      </ADescriptions>
    </ACard>
  </ASpace>
</template>
