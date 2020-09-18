import Vue from 'vue'
import Game from './2048.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Game),
}).$mount('#app')
