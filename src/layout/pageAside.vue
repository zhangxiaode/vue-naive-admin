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
      @update:value="switchPage"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, h, Component } from "vue";
import { useRoute, useRouter, RouteRecordRaw } from "vue-router";
import { NIcon } from 'naive-ui'
import { BookOutline } from '@vicons/ionicons5'
import { baseStore } from "@/store/index";
const route = useRoute();
const router = useRouter();

const collapse = computed(() => baseStore().collapse);
function renderIcon (icon: Component){
  return () => h(NIcon, null, { default: () => h(icon) })
} 
const permission = computed(() => {
  let permission: Array<any> = [];
  router.options.routes.map((item: RouteRecordRaw) => {
    if (item.meta && item.meta.title) {
      let children: Array<any> = [];
      if (item.children && item.children.length > 0) {
        item.children.map((child: any) => {
          if(!(child.meta.hidden === true)) {
            children.push({
              key: `${item.path}/${child.path}`,
              label: child.meta.title,
              icon: child.meta.icon ? child.meta.icon : null,
              hidden: child.meta.hidden ? child.meta.hidden : null,
            });
          }
        });
      }
      if(!(item.meta.hidden === true)) {
        permission.push({
          key: item.path,
          label: item.meta.title,
          icon: item.meta.icon ? renderIcon(BookOutline) : null,
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
            icon: child.meta.icon ? child.meta.icon : null,
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


  // .n-submenu .n-menu-item-content-header {
  //   color: #ffffff !important;
  // }
  // .n-submenu .n-menu-item-content__arrow {
  //   color: #ffffff !important;
  // }
  // .n-menu-item,
  // .n-menu-item-content-header,
  // .n-submenu-children .n-menu-item {
  //   height: 40px;
  //   line-height: 40px;
  //   margin: 8px 0;
  // }
  // .n-menu-item .n-menu-item-content:hover {
  //   background: #363b51;
  // }
  // .n-menu-item,
  // .n-menu-item-content:hover {
  //   background: none;
  // }
  // .n-menu-item .n-menu-item-content:hover {
  //   background: none;
  // }
  // .n-submenu-children .n-menu-item .n-menu-item-content:hover {
  //   color: #04ffff;
  //   background: #40455b;
  // }
  // .n-menu-item,
  // .n-menu-item-content-header {
  //   margin: 0;
  // }
  // .n-submenu {
  //   margin: 8px 0;
  // }
  // .n-menu-item {
  //   background: none;
  // }
  // .n-submenu .n-submenu-children {
  //   background: #363b51;
  // }
  // .n-submenu.is-active .n-menu-item-content-header {
  //   color: #04ffff !important;
  //   i {
  //     color: #04ffff !important;
  //   }
  // }
  // .n-submenu .n-menu-item .n-menu-item-content--selected {
  //   background: #40455b;
  //   border-right: solid 2px #40455b;
  //   &:before {
  //     content: "";
  //     position: absolute;
  //     left: 0;
  //     top: 0;
  //     width: 4px;
  //     height: 40px;
  //     background: #40455b;
  //     border-top-right-radius: 6px;
  //     border-bottom-right-radius: 6px;
  //   }
  // }
  // .n-menu-item-content__icon {
  //   margin-right: 6px;
  //   width: 24px;
  //   height: 24px;
  //   color: #fff;
  // }
}
</style>
