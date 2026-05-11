import type { AnyResBT, ErrResBT, ErrT, OkResBT } from './BrandedTypes'
import {
  suffixErrResBT,
  suffixOkResBT,
} from './BrandedTypes'



export function isNotNullObj(val: unknown): val is object {
  return typeof val === 'object' && val !== null
}

export function hasProp<
  T extends object,
  TP extends string,
>(obj: T, prop: TP): obj is T & Record<TP, unknown> {
  return prop in obj
}

export function isObjWithProp<
  T,
  TP extends string,
>(obj: T, prop: TP): obj is T & Record<TP, unknown> {
  return (
    isNotNullObj(obj) && hasProp(obj, prop)
  )
}



export function isResBT(res: unknown): res is AnyResBT {
  return (
    isObjWithProp(res, '_brand') &&
    isObjWithProp(res._brand, 'brand') &&
    isObjWithProp(res._brand, 'ok')
  )
}


/** Ok branch of `T` when `T` is a result or union of results (e.g. `OkResBT<V> | ErrResBT` → `OkResBT<V>`). */
export type ExtractOkT<T> = T extends { readonly _brand: { readonly ok: true } } ? T : never

/** Err branch of `T` when `T` is a result or union of results. */
export type ExtractErrT<T> = T extends { readonly _brand: { readonly ok: false } } ? T : never

export function isOkRes<T>(res: T): res is ExtractOkT<T> {
  return isResBT(res) && res._brand.ok
}

export function isErrRes<T>(res: T): res is ExtractErrT<T> {
  return isResBT(res) && !res._brand.ok
}



export function makeOkRes<
  T,
  TTags extends string[] = string[],
>(
  value: T,
  tags: TTags = ['success'] as TTags,
): OkResBT<T, TTags> {
  return {
    value,
    _brand: {
      brand: suffixOkResBT,
      ok: true as const,
      tags,
      errors: undefined,
    },
  } // as OkResBT<T, TTags>
}


export function makeErrRes<
  TValue = undefined,
  TTags extends string[] = string[],
  TErrors extends ErrT[] = ErrT[],
>(
  value: TValue,
  errors: TErrors = [{ id: '', msg: '', trace: '' }] as TErrors,
  tags: TTags = ['error'] as TTags,
): ErrResBT<TValue, TTags, TErrors> {
  return {
    value,
    _brand: {
      brand: suffixErrResBT,
      ok: false as const,
      tags,
      errors: errors,
    },
  } // as ErrResBT<TValue, TBrand, TTags, TErrors>
}


export const errRes = (errors: ErrT) => makeErrRes(undefined, [errors as typeof errors])
export const okRes = <TValue>(value: TValue) => makeOkRes(value)
