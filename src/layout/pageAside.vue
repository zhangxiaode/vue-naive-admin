<template>
  <div class="pageLeft flex flex-column ai-normal jc-between h-100">
    <transition name="fade">
      <div class="logoTitle flex jc-center ai-center cursor-pointer">
        <img src="../assets/logo.png" class="logo" @click="homeUrlFun()" />
        <!-- <div class="title" @click="homeUrlFun()">考拉持家</div> -->
      </div>
    </transition>
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :collapsed="collapse"
      show-trigger
      @collapse="collapse = true"
      @expand="collapse = false"
    >
      <n-menu
        :collapsed="collapse"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="permission"
        :render-label="renderMenuLabel"
        :render-icon="renderMenuIcon"
        :expand-icon="expandIcon"
      />
    </n-layout-sider>
    <!-- <el-menu
      class="flex-1"
      :collapse="collapse"
      unique-opened
      background-color="#363b51"
      :default-active="defaultActive"
      text-color="rgba(255,255,255,0.6)"
      active-text-color="#04FFFF"
      router
    >
      <template v-for="(item, index) in permission">
        <el-sub-menu
          :index="item.path"
          :key="`submenu-${index}`"
          v-if="!item.hidden && item.children && item.children.length > 0"
        >
          <template #title>
            <img v-if="item.icon" class="menu-icon" :src="item.icon" alt="" />
            <span v-if="item.title">{{ item.title }}</span>
          </template>
          <el-menu-item
            v-for="(child, idx) in item.children"
            :key="`menu-item-${idx}`"
            v-show="!child.hidden"
            :index="child.path"
          >
            <img v-if="child.icon" class="menu-icon" :src="child.icon" alt="" />
            <template #title>{{ child.title }}</template>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else-if="!item.hidden" :index="item.path" :key="index">
          <img v-if="item.icon" class="menu-icon" :src="item.icon" alt="" />
          <template #title>{{ item.title }}</template>
        </el-menu-item>
      </template>
    </el-menu> -->
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute, useRouter, RouteRecordRaw } from "vue-router";
import store from "@/store";
const route = useRoute();
const router = useRouter();

const collapse = computed(() => store.getters.collapse === "1");
const permission = computed(() => {
  let permission: Array<any> = [];
  router.options.routes.map((item: RouteRecordRaw) => {
    if (item.meta && item.meta.title) {
      let children: Array<any> = [];
      if (item.children && item.children.length > 0) {
        item.children.map((child: any) => {
          children.push({
            path: `${item.path}/${child.path}`,
            title: child.meta.title,
            icon: child.meta.icon ? child.meta.icon : null,
            hidden: child.meta.hidden ? child.meta.hidden : null,
          });
        });
      }
      permission.push({
        path: item.path,
        title: item.meta.title,
        icon: item.meta.icon ? item.meta.icon : null,
        hidden: item.meta.hidden ? item.meta.hidden : null,
        children,
      });
    } else if (item.children && item.children.length > 0) {
      item.children.map((child: any) => {
        permission.push({
          path: `${item.path}/${child.path}`,
          title: child.meta.title,
          icon: child.meta.icon ? child.meta.icon : null,
          hidden: child.meta.hidden ? child.meta.hidden : null,
        });
      });
    }
  });
  return permission;
});
const defaultActive = computed(() => route.path);
const homeUrlFun = () => {
  router.push("/activity/list");
};
</script>

<style lang="scss" scoped>
.pageLeft {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}
.logoTitle {
  flex-wrap: nowrap;
  height: 64px;
  box-sizing: border-box;
  border-right: solid 1px #464b61;
  .logo {
    width: 50px;
    height: 50px;
    margin: 0 5px;
  }
  .title {
    color: #fff;
    font-size: 16px;
    line-height: 64px;
  }
}
:deep(.el-divider--horizontal) {
  margin: 0;
}
:deep(.el-menu) {
  border-right: none;
  background: #363b51;
  width: 200px;
  &.el-menu--collapse {
    width: 64px;
  }
  .el-sub-menu.is-active > .el-sub-menu__title {
    color: #ffffff !important;
    i {
      color: #ffffff !important;
    }
  }
  .el-menu-item,
  .el-sub-menu__title,
  .el-sub-menu .el-menu-item {
    height: 40px;
    line-height: 40px;
    margin: 8px 0;
  }
  .el-menu-item:hover {
    background: #363b51;
  }
  .el-menu-item,
  .el-sub-menu__title:hover {
    background: none;
  }
  .el-menu-item:hover {
    background: none;
  }
  .el-sub-menu .el-menu-item:hover {
    color: #04ffff;
    background: #40455b;
  }
  .el-menu-item,
  .el-sub-menu__title {
    margin: 0;
  }
  .el-sub-menu {
    margin: 8px 0;
  }
  .el-menu-item.is-active {
    background: none;
  }
  .el-sub-menu .el-menu {
    background: #363b51;
  }
  .el-sub-menu.is-active .el-sub-menu__title {
    color: #04ffff !important;
    i {
      color: #04ffff !important;
    }
  }
  .el-sub-menu .el-menu-item.is-active {
    background: #40455b;
    border-right: solid 2px #40455b;
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 4px;
      height: 40px;
      background: #40455b;
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }
  }
}
.menu-icon {
  margin-right: 6px;
  width: 24px;
  height: 24px;
}
</style>
