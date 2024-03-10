export type NestedPartial<T> = T extends object
  ? T extends any[]? Array<NestedPartial<T[number]>> :{
      [K in keyof T]?: NestedPartial<T[K]>;
    }
  : T;
