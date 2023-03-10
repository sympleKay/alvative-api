import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { LoginUserValidator } from 'App/Validators/AuthValidator'
import { UserService } from 'App/Services/user.service'
import { Utils } from 'App/Utils/helper.util'
import BadRequestException from 'App/Exceptions/BadRequestException'

export default class AuthController {
  private httpResponse = Utils.httpResponse
  public async loginUser({ request, response, auth }: HttpContextContract) {
    try {
      const { email, password } = await request.validate(LoginUserValidator)

      const resp = await UserService.signIn(email, password, auth)
      if (resp.status) {
        return this.httpResponse(response, 200, true, resp.message, resp.data)
      }
      return this.httpResponse(response, 500, false, 'Could not login user', null)
    } catch (error) {
      if (error.status === 400) {
        throw new BadRequestException(error.message)
      }
      throw error
    }
  }

  public async user({ response, auth }: HttpContextContract) {
    try {
      const resp = await UserService.currentUser(String(auth.user?.id))
      if (resp.status) {
        return this.httpResponse(response, 200, true, resp.message, resp.data)
      }
      return this.httpResponse(response, 500, false, 'Could not login user', null)
    } catch (error) {
      if (error.status === 400) {
        throw new BadRequestException(error.message)
      }
      throw error
    }
  }
}
