import { errRes, isErrRes, isOkRes, makeErrRes, makeOkRes } from '../../shared/utils/brand/brandedFns'
import { type ErrResBT, type OkResBT } from '../../shared/utils/brand/BrandedTypes'



export function tryCatchAsync<TReturn>(
  asyncData: Promise<TReturn>,
  errId?: string,
): Promise<ErrResBT | OkResBT<TReturn>> {
  return asyncData
    .then((data) => {
      return makeOkRes(data)
    })
    .catch((err) => {
      const e = err as Error
      return makeErrRes(
        undefined,
        [{
          id: errId || e.name,
          name: e.name,
          msg: e.message,
          trace: e.stack,
          cause: String(e.cause),
        }],
      )
    })
}



type TryCatchResT<TRes> =
  TRes extends ErrResBT
    ? ErrResBT
    : TRes extends OkResBT<infer TValue> /* , infer TTags */
      ? OkResBT<TValue>
      : OkResBT<TRes> | ErrResBT

      

export const tryCatchAsyncWrap = <TArgs, TRes>(
  AsyncFn: (args: TArgs) => Promise<TRes>,
  errId?: string,
) => async (args: TArgs): Promise<TryCatchResT<TRes>> => {
  try {
    const res = await AsyncFn(args)
    if (isErrRes(res) || isOkRes(res)) {
      return res as TryCatchResT<TRes>
    }
    return makeOkRes(res) as TryCatchResT<TRes>
  }
  catch (err) {

    return errRes({
      id: errId || 'async_error',
      msg: typeof err === 'string' ? err : String(err),
    }) as TryCatchResT<TRes>
  }
}


export function tryCatch<TArgs, TRes>(
  fn: (args: TArgs) => TRes,
  args: TArgs,
  errId?: string,
): TryCatchResT<TRes> {
  try {
    const res = fn(args)
    if (isErrRes(res) || isOkRes(res)) {
      return res as TryCatchResT<TRes>
    }
    return makeOkRes(res) as TryCatchResT<TRes>
  }
  catch (err) {
    const e = err as Error
    return makeErrRes(
      undefined,
      [{
        id: errId || e.name,
        name: e.name,
        msg: e.message,
        trace: e.stack,
        cause: String(e.cause),
      }],
    ) as TryCatchResT<TRes>
  }
}


// --- usage examples (same file) //

// const throwingValue = 1n
// export const tryCatchExample = tryCatch(JSON.stringify, throwingValue)
// console.dir(tryCatchExample, { depth: 5 })

// async function throwsIfNotOne(num: number) {
//   if (num !== 1) throw new Error('not_one_error')
//   return num
// }

// const asyncTryCatchEx = await asyncTryCatch(throwsIfNotOne(0))
// console.dir(asyncTryCatchEx, { depth: 5 })
