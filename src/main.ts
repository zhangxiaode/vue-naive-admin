import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"
import { createPinia } from 'pinia'
const pinia = createPinia()
// import { elTableDrag } from "@/directive/index";
import NaiveUI from "naive-ui";

import "@/styles/index.scss";

router.beforeEach((to) => {
  // const main = useMainStore(pinia)
  // if (to.meta.requiresAuth && !main.isLoggedIn) return '/login'
})
createApp(App)
  // .use(elTableDrag)
  .use(pinia)
  .use(router)
  .use(NaiveUI)
  .mount("#app");