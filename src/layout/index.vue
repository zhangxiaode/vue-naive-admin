<template>
  <n-layout has-sider class="layout h-100 flex">
    <n-layout-sider
      class="aside" 
      collapse-mode="width"
      :collapsed-width="64"
      :width="200"
      :collapsed="collapse"
      show-trigger
      @collapse="changeCollapse"
      @expand="changeCollapse">
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
import { computed, ref } from "vue";
import { baseStore } from "@/store/index";
import PageHeader from "./pageHeader.vue";
import PageAside from "./pageAside.vue";
const collapse = computed(() => baseStore().collapse);
const changeCollapse = () => {
  baseStore().changeCollapse()
};
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
