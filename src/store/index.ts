import { createPinia } from 'pinia'
import baseStore from './base'

export function useStore() {
  return {
    base: baseStore()
  }
}
export default createPinia()