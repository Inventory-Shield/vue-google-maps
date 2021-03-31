import type { ComponentObjectPropsOptions } from 'vue'

/**
 * Strips out the extraneous properties we have in our
 * props definitions
 */
export default function (mappedProps: Record<string, PropOptions>): ComponentObjectPropsOptions {
  return Object.entries(mappedProps)
    .map(([key, prop]) => {
      const value: PropOptions = {}

      if ('type' in prop) value.type = prop.type
      if ('default' in prop) value.default = prop.default
      if ('required' in prop) value.required = prop.required

      return [key, value]
    })
    .reduce((acc, [key, val]) => {
      acc[key as string] = val as PropOptions
      return acc
    }, {} as ComponentObjectPropsOptions)
}
