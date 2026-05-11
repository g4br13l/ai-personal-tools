import { isErrRes, okRes } from '../../shared/utils/brand/brandedFns'
import type { ErrResBT, OkResBT } from '../../shared/utils/brand/BrandedTypes'



type FunctionT<TData> = (arg: TData) => TData

type FnPipeResT<TData> = ErrResBT | OkResBT<TData>

type AsyncFunctionT<TData> = (arg: TData) =>
  ErrResBT | OkResBT<TData> | Promise<ErrResBT | OkResBT<TData>>



export const fnPipe =
  <TData>(...fns: Array<FunctionT<TData>>) => {
    return (data: TData) => {
      return fns.reduce((prev, currFn) => currFn(prev), data)
    }
  }


export const pipeStep =
  async <TInput, TOutput>(
    prevRes: ErrResBT | OkResBT<TInput>,
    nextFn: (value: TInput) => FnPipeResT<TOutput> | Promise<FnPipeResT<TOutput>>,
  ): Promise<FnPipeResT<TOutput>> => {
  
    if (isErrRes(prevRes)) return prevRes
    return nextFn(prevRes.value)
  }


export const fnPipeAsync =
  <TData>(data: TData) =>
    async (...fns: Array<AsyncFunctionT<TData>>) => {

      let result: FnPipeResT<TData> = okRes(data)

      for (const pipeFn of fns) {
        result = await pipeStep(result, pipeFn)
        if (isErrRes(result)) return result
      }

      return result
    }



export const newFnPipeAsync =
  <TData>(...fns: Array<AsyncFunctionT<TData>>):
  (data: TData) => Promise<ErrResBT | OkResBT<TData>> =>
    async (data: TData) => {
      
      let result: FnPipeResT<TData> = okRes(data)

      for (const pipeFn of fns) {
        result = await pipeStep(result, pipeFn)
        if (isErrRes(result)) return result
      }

      return result
    }

