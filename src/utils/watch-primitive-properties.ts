import { nextTick, watch, ref } from 'vue';

/**
 * Watch the individual properties of a PoD object, instead of the object
 * per se. This is different from a deep watch where both the reference
 * and the individual values are watched.
 *
 * In effect, it throttles the multiple $watch to execute at most once per tick.
 */
export default function watchPrimitiveProperties <T, K extends keyof T>(target: T, propertiesToTrack: Array<K>, handler: () => void, immediate = false) {
  let isHandled = false

  function requestHandle () {
    if (!isHandled) {
      isHandled = true
      nextTick(() => {
        isHandled = false
        handler()
      })
    }
  }

  for (const prop of propertiesToTrack) {
    const reactiveProp = ref(target[prop]);
    watch(reactiveProp, requestHandle, { immediate });
  }
}
