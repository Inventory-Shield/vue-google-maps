/*
Mixin for objects that are mounted by Google Maps
Javascript API.

These are objects that are sensitive to element resize
operations so it exposes a property which accepts a bus

*/
import { ComponentOptionsMixin, defineComponent } from "vue";

const mountable: ComponentOptionsMixin = defineComponent({
  props: ['resizeBus'],

  data () {
    return {
      _actualResizeBus: null as unknown
    }
  },
  
  computed: {
    actualResizeBus(): unknown {
      return this._actualResizeBus;
    }
  },

  created () {
    if (typeof this.resizeBus === 'undefined') {
      this._actualResizeBus = this.$gmapDefaultResizeBus
    } else {
      this._actualResizeBus = this.resizeBus
    }
  },

  methods: {
    _resizeCallback () {
      this.resize()
    },
    _delayedResizeCallback () {
      this.$nextTick(() => this._resizeCallback())
    }
  },

  watch: {
    resizeBus (newVal) {
      this._actualResizeBus = newVal
    },
    actualResizeBus (newVal, oldVal) {
      if (oldVal) {
        oldVal.$off('resize', this._delayedResizeCallback)
      }
      if (newVal) {
        newVal.$on('resize', this._delayedResizeCallback)
      }
    }
  },

  destroyed () {
    if (this._actualResizeBus) {
      this._actualResizeBus.$off('resize', this._delayedResizeCallback)
    }
  }
})

export default mountable;
