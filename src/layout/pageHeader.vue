<template>
  <div class="pageHeader flex jc-between ai-center h-100">
    <div class="collapse flex ai-center cursor-pointer">
      <el-icon :size="64" color="#eee" @click="changeCollapse()">
        <Expand v-if="collapse" />
        <Fold v-else />
      </el-icon>
      <el-breadcrumb class="breadcrumb" :separator-icon="ArrowRight">
        <el-breadcrumb-item
          v-for="(item, index) in route.matched"
          :key="item.meta.code"
          :to="index < route.matched.length - 1 ? item.path : null"
          >{{ item.meta.title }}</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <el-dropdown
      class="userInfo cursor-pointer"
      trigger="click"
      @command="logout"
    >
      <div class="avatar-wrapper flex ai-center h-100">
        <img
          :src="avatar || require('../assets/photo.png')"
          class="userPhoto"
        />
        <p class="userName">
          <span class="text-topText">{{ name || "游客" }}</span>
        </p>
        <i class="slideDown" />
      </div>
      <template #dropdown>
        <el-dropdown-menu class="user-dropdown">
          <el-dropdown-item command="退出">退出系统</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Cookies from "js-cookie";
import store from "@/store";
// import { GameControllerOutline, GameController } from '@vicons/ionicons5'
import { Fold, Expand, ArrowRight } from "@element-plus/icons-vue";
const route = useRoute();
const router = useRouter();

const collapse = computed(() => store.getters.collapse === "1");
const name = computed(() => store.getters.name);
const avatar = computed(() => store.getters.avatar);
const logout = () => {
  router.push("/login");
};
const changeCollapse = () => {
  store.commit("app/TOGGLE_COLLAPSE");
};
Cookies.set("collapse", "0");
</script>

<style lang="scss" scoped>
.pageHeader {
  color: #fff;
}
.collapse {
  svg {
    font-size: 22px;
  }
}
.breadcrumb {
  :deep(.el-breadcrumb__item .el-breadcrumb__inner) {
    color: #999;
  }
  :deep(.el-breadcrumb__inner.is-link) {
    color: #ccc;
    &:hover {
      color: #fff;
    }
  }
}
.userInfo {
  margin-right: 20px;
}
.userPhoto {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
.userName {
  margin-left: 10px;
  margin-right: 6px;
}
.text-topText {
  font-size: 14px;
  color: #ffffff;
}
.slideDown {
  transform-origin: cneter;
  transform: scale(0.6);
  font-size: 12px;
  color: #999999;
}
</style>
