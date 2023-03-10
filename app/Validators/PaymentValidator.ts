import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class InitializePaymentValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    amount: schema.number(),
  })

  public cacheKey = this.ctx.routeKey

  public messages: CustomMessages = {
    'amount.required': 'Amount is required',
  }
}

export class VerifyBankDetailValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    bankCode: schema.string(),
    accountNumber: schema.string(),
  })

  public cacheKey = this.ctx.routeKey

  public messages: CustomMessages = {
    'bankCode.required': 'Amount is required',
    'accountNumber.required': 'Account number is required',
  }
}

export class VerifyTransactionValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    ref: schema.string({}, [rules.exists({ table: 'transactions', column: 'reference' })]),
  })

  public cacheKey = this.ctx.routeKey

  public messages: CustomMessages = {
    'ref.required': 'Amount is required',
    'ref.exists': 'Invalid Transaction reference provided',
  }
}
