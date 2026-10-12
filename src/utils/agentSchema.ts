import type { ZodType } from 'zod'

export function toJSONSchema(schema: ZodType) {
  return schema.toJSONSchema({
    override({ jsonSchema }) {
      // 千问模型无法识别到 propertyNames 的类型，导致无法生成正确的 JSON Schema，所以这里删除掉 propertyNames
      delete jsonSchema.propertyNames
    },
  })
}
