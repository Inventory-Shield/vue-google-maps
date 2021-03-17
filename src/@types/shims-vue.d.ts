// This lets TypeScript know to expect Vue components from .vue files that use object syntax.

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, unknown>;
  export default component;
}
