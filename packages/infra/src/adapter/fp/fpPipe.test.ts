import { expect, test, describe } from 'bun:test'
import { fnPipe } from './fpPipe.adap'



describe('fpPipe.adap tests', () => {

  test('Should return 2 for add1 => add2 => sub1 functions with 0 init', () => {
    // arrange
    const initValue: number = 0
    const add1 = (n: number) => n + 1
    const add2 = (n: number) => n + 2
    const sub1 = (n: number) => n - 1
    // act
    const res = fnPipe(add1, add2, sub1)(initValue)
    // assert
    expect(res).toBe(2)
  })

  test('Should return a msg text for a pipe with different types manipulations', () => {
    // arrange
    type DataT = { num: number, isPositive?: boolean, msg?: string }
    const initData = { num: 0 } satisfies DataT

    const add1 = (d: DataT) => ({ num: d.num + 1 }) /* as DataT */
    const isPositive = (d: DataT) => ({ ...d, isPositive: d.num > 0 }) /* as DataT */
    const showMsg = (d: DataT) =>
      ({ ...d, msg: d.isPositive ? 'is_positive' : 'isNotPositive' }) /* as DataT */

    // act
    const res = fnPipe<DataT>(add1, isPositive, showMsg)(initData)
    
    // assert
    expect(res).toEqual({ num: 1, isPositive: true, msg: 'is_positive' })
  })

})
