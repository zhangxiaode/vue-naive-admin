import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
// import store from "./store";
// import { elTableDrag } from "@/directive/index";
import NaiveUI from "naive-ui";

import "@/styles/index.scss";

createApp(App)
  // .use(elTableDrag)
  // .use(store)
  .use(router)
  .use(NaiveUI)
  .mount("#app");