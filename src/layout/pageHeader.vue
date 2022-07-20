<template>
  <div class="pageHeader flex jc-between ai-center h-100">
    <n-breadcrumb class="breadcrumb" separator=" > ">
      <n-breadcrumb-item v-for="(item, index) in route.matched" :key="item.meta.code" :href="index < route.matched.length - 1 ? item.path : null">{{ item.meta.title }}</n-breadcrumb-item>
    </n-breadcrumb>
    <n-dropdown trigger="click" :options="[{ label: '退出系统', key: '退出' }]" @select="logout">
      <div class="userInfo cursor-pointer flex ai-center h-100">
        <img v-if="avatar" :src="avatar" class="userPhoto" />
        <img v-else src="../assets/photo.png" class="userPhoto" />
        <p class="userName">
          <span class="text-topText">{{ name || "游客" }}</span>
        </p>
        <i class="slideDown" />
      </div>
    </n-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { baseStore } from "@/store/index";
import { PlaySkipBackCircleOutline, PlaySkipForwardCircleOutline } from '@vicons/ionicons5'

const route = useRoute();
const router = useRouter();
const name = ''
const avatar = null
// const name = computed(() => store.getters.name);
// const avatar = computed(() => store.getters.avatar);
const logout = (key: string) => {
  if(key == '退出') {
    router.push("/login");
  }
};
</script>

<style lang="scss" scoped>
.pageHeader {
  color: #fff;
}
.collapse {
  height: 64px;
}
.breadcrumb {
  padding: 0 0 0 20px;
}
:deep(.n-breadcrumb) {
  .n-breadcrumb-item .n-breadcrumb-item__link {
    color: #ccc;
    &:hover {
      color: #fff;
    }
  }
  .n-breadcrumb-item:last-child .n-breadcrumb-item__link {
    color: #999;
    &:hover {
      color: #999;
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
