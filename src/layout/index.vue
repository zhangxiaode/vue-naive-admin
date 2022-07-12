<template>
  <n-layout has-sider class="layout h-100 flex">
    123
    <n-layout-sider width="auto" class="aside">
      <PageAside />
    </n-layout-sider>
    <n-layout class="flex-1 flex ai-normal overflow-hidden">
      <n-layout-header class="header"><PageHeader /></n-layout-header>
      <n-layout-content class="main flex-1">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup>
import PageHeader from "./pageHeader.vue";
import PageAside from "./pageAside.vue";
</script>

<style lang="scss" scoped>
.layout {
  // background: #40455b;
}
.header {
  background: #363b51;
  height: 64px;
  padding: 0;
}
.aside {
  background: #363b51;
}
.main {
  margin: 16px 16px 0;
  padding: 0;
}
</style>
