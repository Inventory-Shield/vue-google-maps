// This piece of code was orignally written by sindresorhus and can be seen here
// https://github.com/sindresorhus/lazy-value/blob/master/index.js

export default <T>(fn: () => T): () => T => {
  let called = false
  let ret: T

  return () => {
    if (!called) {
      called = true
      ret = fn()
    }

    return ret
  }
}
