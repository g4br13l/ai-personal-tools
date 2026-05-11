import type z from 'zod'



export type ZodShapeKeysT<T> =
  Extract<keyof T, string>

export type ZodDescriptionT<T extends z.ZodRawShape> =
  Partial<Record<ZodShapeKeysT<T>, string>>

export type ZodDescribedShapeT<T extends z.ZodRawShape> = {
  [K in keyof T]: T[K]
}



function addDescriptionsToShape<T extends z.ZodRawShape>(
  schemaShape: T,
  descriptions: ZodDescriptionT<T>,
) {
  const describedShape = {} as ZodDescribedShapeT<T>
  for (const key of Object.keys(schemaShape) as Array<ZodShapeKeysT<T>>) {
    const schema = schemaShape[key] as z.ZodTypeAny
    const description = descriptions[key]
    const describedSchema = description ? schema.describe(description) : schema
    describedShape[key] = describedSchema as unknown as ZodDescribedShapeT<T>[typeof key]
  }
  return describedShape
}



// function zodToJsonSchema<TSchema extends z.ZodType>(zodSchema: TSchema) {
//   const jsonSchema = z.toJSONSchema(zodSchema, {
//     unrepresentable: 'any',
//     override: (ctx) => {
//       if (ctx.zodSchema._zod.def.type === 'date') {
//         ctx.jsonSchema.type = 'string'
//         ctx.jsonSchema.format = 'date-time'
//       }
//     },
//   })
//   return jsonSchema
// }



export const zodHelper = {
  addDescriptionsToShape,
  // zodToJsonSchema,
}
