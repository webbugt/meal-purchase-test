type ReplaceNullWithUndefined<T> = T extends null ? undefined : T extends Date ? T : {
  [K in keyof T]: T[K] extends (infer U)[] ? ReplaceNullWithUndefined<U>[] : ReplaceNullWithUndefined<T[K]>;
};

export function nullToUndefined<T> (obj: T): ReplaceNullWithUndefined<T> {
  if (obj === null || typeof obj === 'undefined') {
    return undefined as any
  }
  if (obj.constructor.name === 'Object') {
    for (const key in obj) {
      obj[key] = nullToUndefined(obj[key]) as any
    }
  }
  return obj as any
}
