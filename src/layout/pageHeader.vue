<template>
  <div class="pageHeader flex jc-between ai-center h-100">
    <div class="collapse flex ai-center cursor-pointer">
      <n-icon :size="64" color="#eee" @click="changeCollapse()">
        <CaretForward v-if="collapse" />
        <CaretBack v-else />
      </n-icon>
      <n-breadcrumb class="breadcrumb" :separator="AngleRight" :separator-icon="ChevronForward">
        <n-breadcrumb-item v-for="(item, index) in route.matched" :key="item.meta.code" :href="index < route.matched.length - 1 ? item.path : null">{{ item.meta.title }}</n-breadcrumb-item>
      </n-breadcrumb>
    </div>
    <n-dropdown class="userInfo cursor-pointer" trigger="click" :options="[{ label: '退出系统', key: '退出' }]" @select="logout">
      <div class="avatar-wrapper flex ai-center h-100">
        <img
          :src="avatar || '../assets/photo.png'"
          class="userPhoto"
        />
        <p class="userName">
          <span class="text-topText">{{ name || "游客" }}</span>
        </p>
        <i class="slideDown" />
      </div>
    </n-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Cookies from "js-cookie";
import store from "@/store";
import { AngleRight, CaretBack, CaretForward, ChevronForward } from '@vicons/ionicons5'
const route = useRoute();
const router = useRouter();

const collapse = computed(() => store.getters.collapse === "1");
const name = computed(() => store.getters.name);
const avatar = computed(() => store.getters.avatar);
const logout = (key: string) => {
  if(key == '退出') {
    router.push("/login");
  }
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
