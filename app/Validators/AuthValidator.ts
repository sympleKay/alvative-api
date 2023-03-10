import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class LoginUserValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.exists({ table: 'users', column: 'email' }),
    ]),
    password: schema.string({ trim: true }),
  })

  public cacheKey = this.ctx.routeKey

  public messages: CustomMessages = {
    'email.required': 'Email is required',
    'email.exist': 'Invalid email or password',
    'password.required': 'Please provide your password',
  }
}
