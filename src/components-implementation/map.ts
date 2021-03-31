import { defineComponent } from 'vue'
import type { ComponentOptionsMixin, PropType } from 'vue'
import bindEvents from '../utils/bind-events'
import { bindProps, getPropsValues } from '../utils/bind-props'
import mountableMixin from '../mixins/mountable'

import twoWayBindingWrapper from '../utils/two-way-binding-wrapper'
import watchPrimitiveProperties from '../utils/watch-primitive-properties'
import mappedPropsToVueProps from '../utils/mapped-props-to-vue-props'

interface MapOptions {
  recycle?: string;
}

declare global {
  interface Window {
    [key: string]: {
      div?: HTMLElement;
      map?: google.maps.Map;
    };
  }
}

const props: Record<string, PropOptions> = {
  center: {
    required: true,
    twoWay: true,
    type: Object,
    noBind: true
  },
  zoom: {
    required: false,
    twoWay: true,
    type: Number,
    noBind: true
  },
  heading: {
    type: Number,
    twoWay: true
  },
  mapTypeId: {
    twoWay: true,
    type: String
  },
  tilt: {
    twoWay: true,
    type: Number
  },
  options: {
    type: Object as PropType<MapOptions>,
    default () { return {} }
  }
}

const events = [
  'bounds_changed',
  'click',
  'dblclick',
  'drag',
  'dragend',
  'dragstart',
  'idle',
  'mousemove',
  'mouseout',
  'mouseover',
  'resize',
  'rightclick',
  'tilesloaded'
]

const recyclePrefix = '__gmc__'

const map: ComponentOptionsMixin = defineComponent({
  mixins: [mountableMixin],
  props: mappedPropsToVueProps(props),

  provide () {
    this.$mapPromise = new Promise((resolve, reject) => {
      this.$mapPromiseDeferred = { resolve, reject }
    })
    return {
      $mapPromise: this.$mapPromise
    }
  },

  computed: {
    finalLat () {
      return this.center &&
        (typeof this.center.lat === 'function') ? this.center.lat() : this.center.lat
    },
    finalLng () {
      return this.center &&
        (typeof this.center.lng === 'function') ? this.center.lng() : this.center.lng
    },
    finalLatLng () {
      return { lat: this.finalLat, lng: this.finalLng }
    }
  },

  watch: {
    zoom (zoom) {
      if (this.$mapObject) {
        this.$mapObject.setZoom(zoom)
      }
    }
  },

  beforeDestroy () {
    const recycleKey = this.getRecycleKey()
    if (window[recycleKey]) {
      window[recycleKey].div = this.$mapObject.getDiv()
    }
  },

  mounted () {
    return this.$gmapApiPromiseLazy().then(() => {
      // getting the DOM element where to create the map
      const element = this.$refs['vue-map']

      // creating the map
      const initialOptions = {
        ...this.options,
        ...getPropsValues(this, props)
      }

      // don't use delete keyword in order to create a more predictable code for the engine
      let { options, ...finalOptions } = initialOptions
      options = finalOptions

      const recycleKey = this.getRecycleKey()
      if (this.options.recycle && window[recycleKey]) {
        element.appendChild(window[recycleKey].div)
        this.$mapObject = window[recycleKey].map
        this.$mapObject.setOptions(options)
      } else {
        // console.warn('[vue2-google-maps] New google map created')
        this.$mapObject = new google.maps.Map(element, options)
        window[recycleKey] = { map: this.$mapObject }
      }

      // binding properties (two and one way)
      bindProps(this, this.$mapObject, props)
      // binding events
      bindEvents(this, this.$mapObject, events)

      // manually trigger center and zoom
      twoWayBindingWrapper((increment, decrement, shouldUpdate) => {
        this.$mapObject.addListener('center_changed', () => {
          if (shouldUpdate()) {
            this.$emit('center_changed', this.$mapObject.getCenter())
          }
          decrement()
        })

        const updateCenter = () => {
          increment()
          this.$mapObject.setCenter(this.finalLatLng)
        }

        watchPrimitiveProperties(
          this,
          ['finalLat', 'finalLng'],
          updateCenter
        )
      })
      this.$mapObject.addListener('zoom_changed', () => {
        this.$emit('zoom_changed', this.$mapObject.getZoom())
      })
      this.$mapObject.addListener('bounds_changed', () => {
        this.$emit('bounds_changed', this.$mapObject.getBounds())
      })

      this.$mapPromiseDeferred.resolve(this.$mapObject)

      return this.$mapObject
    }).catch((error: unknown) => {
      throw error
    })
  },
  methods: {
    // Other convenience methods exposed by Vue Google Maps
    resize () {
      if (this.$mapObject) {
        google.maps.event.trigger(this.$mapObject, 'resize')
      }
    },
    resizePreserveCenter () {
      if (!this.$mapObject) { return }

      const oldCenter = this.$mapObject.getCenter()
      google.maps.event.trigger(this.$mapObject, 'resize')
      this.$mapObject.setCenter(oldCenter)
    },

    /// Override mountableMixin::_resizeCallback
    /// because resizePreserveCenter is usually the
    /// expected behaviour
    _resizeCallback () {
      this.resizePreserveCenter()
    },

    getRecycleKey (): string {
      return this.options.recycle ? recyclePrefix + this.options.recycle : recyclePrefix
    },

    // Plain Google Maps methods exposed here for convenience
    ...[
      'panBy',
      'panTo',
      'panToBounds',
      'fitBounds'
    ].reduce((all, methodName) => {
      all[methodName] = function (...args: unknown[]) {
        if (this.$mapObject) { this.$mapObject[methodName].apply(this.$mapObject, args) }
      }
      return all
    }, {} as Record<string, unknown>),
  }
})

export default map;
