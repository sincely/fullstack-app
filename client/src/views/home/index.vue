<script setup>
import CardData from './modules/card-data.vue'
import CreativityBanner from './modules/creativity-banner.vue'
import HeaderBanner from './modules/header-banner.vue'
import LineChart from './modules/line-chart.vue'
import PieChart from './modules/pie-chart.vue'
import ProjectNews from './modules/project-news.vue'
</script>

<template>
  <a-space direction="vertical" :size="16">
    <HeaderBanner />
    <CardData />
    <a-row :gutter="[16, 16]">
      <a-col :span="24" :lg="14">
        <LineChart />
      </a-col>
      <a-col :span="24" :lg="10">
        <PieChart />
      </a-col>
    </a-row>
    <a-row :gutter="[16, 16]">
      <a-col :span="24" :lg="14">
        <ProjectNews />
      </a-col>
      <a-col :span="24" :lg="10">
        <CreativityBanner />
      </a-col>
    </a-row>
  </a-space>
</template>
