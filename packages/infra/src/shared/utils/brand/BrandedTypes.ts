


export const suffixDefaultBT = 'BT'
export type SuffixDefaultBT = typeof suffixDefaultBT

export const suffixOkResBT = 'OkResBT'
export type SuffixOkResBT = typeof suffixOkResBT

export const suffixErrResBT = 'ErrResBT'
export type SuffixErrResBT = typeof suffixErrResBT

export type SuffixBT = SuffixDefaultBT | SuffixOkResBT | SuffixErrResBT

// export type TagBT = 'success' | 'error' | 'info' | undefined


export type ErrT = {
  readonly id: string
  readonly name?: string
  readonly msg?: string
  readonly trace?: string
  readonly cause?: string
  readonly code?: number
}


export type BrandT<
  TValue,
  TBrand extends string = SuffixBT,
  TOk extends boolean = true,
  TTags extends string[] | undefined = undefined,
  TErrors extends ErrT[] | undefined = TOk extends true ? undefined : ErrT[],
> = {
  readonly value: TValue
  readonly _brand: {
    readonly brand: TBrand
    readonly ok: TOk
    readonly tags: TTags
    readonly errors: TErrors
  }
}


export type ErrResBT<
  TValue = undefined,
  // TBrand extends string = string,
  TTags extends string[] = string[],
  TErrors extends ErrT[] = ErrT[],
> = BrandT<TValue, typeof suffixErrResBT /* TBrand */, false, TTags, TErrors>


export type OkResBT<
  TValue,
  // TBrand extends string = string,
  TTags extends string[] = string[],
> = BrandT<TValue, typeof suffixOkResBT /* TBrand */, true, TTags>


export type ResBT<
  TValue,
  // TBrand extends string = string,
  TTags extends string[] = string[],
  TErr extends ErrT[] = ErrT[],
> = OkResBT<TValue, TTags> | ErrResBT<TValue, TTags, TErr>


export type AsyncResBT<
  TValue,
  // TBrand extends string = string,
  TErr extends ErrT[] = ErrT[],
  TTags extends string[] = string[],
> = Promise<OkResBT<TValue, TTags> | ErrResBT<TValue, TTags, TErr>>



export type AnyResBT<
  TValue = unknown,
> = OkResBT<TValue, string[]> | ErrResBT<TValue, string[], ErrT[]>

export type AnyOkResBT<TValue = unknown> = OkResBT<TValue, string[]>
export type AnyErrResBT = ErrResBT<unknown, string[], ErrT[]>

// export type PromiseResBT<TOk = unknown, TErr = never> = AsyncResBT<TOk, TErr>
