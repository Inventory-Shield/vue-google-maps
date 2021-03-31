import type { PluginOptions } from "../main";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $gmapDefaultResizeBus: unknown;
    $gmapOptions: PluginOptions;
    $gmapApiPromiseLazy: () => Promise<typeof google>;
    $mapPromise: Promise<google.maps.Map>;
    $map: google.maps.Map;
    $panoObject: google.maps.StreetViewPanorama;
  }
}
