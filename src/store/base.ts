import { defineStore } from 'pinia'
const baseStore = defineStore({    
  id: "base",    
  state() {
    return {
      collapse: false
    }
  },
  getters: {
    computedCollapse: (state) => state.collapse
  },
  actions: {
    changeCollapse() {
      this.$state.collapse = !this.$state.collapse
    }
  }
})
export default baseStore