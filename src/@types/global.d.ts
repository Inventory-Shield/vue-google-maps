const GENERATE_DOC: boolean | undefined;

type KeysOf<T> = keyof T;
type ValuesOf<T> = T[KeysOf<T>];

type AnyOf<T> = T[keyof T];

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any
  ? A
  : never;

type Data = Record<string, unknown>;
type DefaultFactory<T> = (props: Data) => T | null | undefined;

interface PropOptions<T = unknown, D = T> {
  type?: PropType<T> | true | null;
  twoWay?: boolean;
  trackProperties?: Array<string>;
  noBind?: boolean;
  required?: boolean;
  default?: D | DefaultFactory<D> | null | undefined | object;
  validator?(value: unknown): boolean;
}
