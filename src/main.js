import Vue from 'vue'
import Wedding from './Wedding.vue'

import VueResource from 'vue-resource'

Vue.use(VueResource);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(Wedding)
})