<template>
  <div class="pageLeft flex flex-column ai-normal jc-between h-100">
    <transition name="fade">
      <div class="logoTitle flex jc-center ai-center cursor-pointer">
        <img src="../assets/logo.png" class="logo" @click="homeUrlFun()" />
      </div>
    </transition>
    <n-menu
      class="flex-1"
      accordion
      :value="route.path"
      :indent="18"
      :collapsed="collapse"
      :collapsed-icon-size="24"
      :collapsed-width="64"
      :options="permission"
      :render-icon="renderIcon"
      @update:value="switchPage"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, h } from "vue";
import { useRoute, useRouter } from "vue-router";
import { baseStore } from "@/store/index";
const router = useRouter();
const route = useRoute();

const collapse = computed(() => baseStore().collapse);
function renderIcon (icon: any){
  if(icon && icon.icon()) {
    return h('img', { src: icon.icon(), class: 'menuIcon' })
  } else {
    return null
  }
} 
const permission = computed(() => {
  let permission: Array<any> = [];
  router.options.routes.map((item: any) => {
    if (item.meta && item.meta.title) {
      let children: Array<any> = [];
      if (item.children && item.children.length > 0) {
        item.children.map((child: any) => {
          if(!(child.meta.hidden === true)) {
            children.push({
              key: `${item.path}/${child.path}`,
              label: child.meta.title,
              icon: () => child.meta.icon ? child.meta.icon : null,
              hidden: child.meta.hidden ? child.meta.hidden : null,
            });
          }
        });
      }
      if(!(item.meta.hidden === true)) {
        permission.push({
          key: item.path,
          label: item.meta.title,
          icon: () => item.meta.icon ? item.meta.icon : null,
          hidden: item.meta.hidden ? item.meta.hidden : null,
          children,
        });
      }
    } else if (item.children && item.children.length > 0) {
      item.children.map((child: any) => {
        if(!(child.meta.hidden === true)) {
          permission.push({
            key: `${item.path}/${child.path}`,
            label: child.meta.title,
            icon: () => child.meta.icon ? child.meta.icon : null,
            hidden: child.meta.hidden ? child.meta.hidden : null,
          });
        }
      });
    }
  });
  return permission;
});
const switchPage = (e: string) => {
  router.push(e);
}
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
:deep(.n-menu) {
  background: #363b51;
  .n-menu-item-content {
    .n-menu-item-content-header {
      color: #fff;
      text-align: left;
    }
    .n-menu-item-content__icon {
      color: #fff;
    }
    .n-menu-item-content__arrow {
      color: #fff;
    }
    &.n-menu-item-content--child-active, &.n-menu-item-content--child-active:hover {
      .n-menu-item-content-header {
        color: #04ffff;
      }
      .n-menu-item-content__icon {
        color: #04ffff;
      }
      .n-menu-item-content__arrow {
        color: #04ffff;
      }
    }
    &.n-menu-item-content--selected, &.n-menu-item-content--selected:hover {
      &::before{
        background: #40455b;
      }
      .n-menu-item-content-header {
        color: #04ffff;
      }
      .n-menu-item-content__icon {
        color: #fff;
      }
      .n-menu-item-content__arrow {
        color: #fff;
      }
    }
    &:hover {
      &::before {
        background: #40455b;
      }
      .n-menu-item-content-header {
        color: #04ffff;
      }
      .n-menu-item-content__icon {
        color: #fff;
      }
      .n-menu-item-content__arrow {
        color: #fff;
      }
    }
  }
  .menuIcon {
    width: 24px;
    height: 24px;
  }
}
</style>
