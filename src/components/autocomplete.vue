<template>
  <span v-if="$slots['input']">
    <slot name="input" v-bind:attrs="$attrs" :ref="input"></slot>
  </span>
  <input v-else-if="!$slots['input']" ref="input" v-bind="$attrs" />
</template>

<script>
export default ((x) => x.default || x)(require('../components-implementation/autocomplete'))
</script>
