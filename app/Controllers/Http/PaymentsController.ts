import { createHmac } from 'crypto'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import BadRequestException from 'App/Exceptions/BadRequestException'
import { PaystackWebhookInterface } from 'App/Interfaces/paystack.interface'
import { PaymentService } from 'App/Services/payment.service'
import { PaystackWebhook } from 'App/Services/webhooks/paystack.webhook'
import { Utils } from 'App/Utils/helper.util'
import {
  InitializePaymentValidator,
  VerifyBankDetailValidator,
  VerifyTransactionValidator,
} from 'App/Validators/PaymentValidator'

export default class PaymentsController {
  private httpResponse = Utils.httpResponse

  public async initialize({ request, response, auth }: HttpContextContract) {
    const { amount } = await request.validate(InitializePaymentValidator)
    try {
      const resp = await PaymentService.initialize(String(auth.user?.id), amount)
      console.log(amount)
      console.log(resp)
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

  public async verifyTransaction({ request, response, auth }: HttpContextContract) {
    const { ref } = await request.validate(VerifyTransactionValidator)
    try {
      const resp = await PaymentService.verifyTransaction(String(auth.user?.id), ref)
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

  public async getBanks({ response }: HttpContextContract) {
    try {
      const resp = await PaymentService.getBanks()
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

  public async verifyBankDetail({ request, response }: HttpContextContract) {
    const { bankCode, accountNumber } = await request.validate(VerifyBankDetailValidator)
    try {
      const resp = await PaymentService.verifyAccountDetails(bankCode, accountNumber)
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

  public async webhookEvent({ request, response }: HttpContextContract) {
    try {
      const hash = createHmac('sha512', Env.get('PAYSTACK_SECRET_KEY'))
        .update(JSON.stringify(request.body()))
        .digest('hex')
      if (hash !== request.headers['x-paystack-signature']) {
        return this.httpResponse(response, 400, false, 'Origin not recognized', null)
      }
      const payload = request.body() as PaystackWebhookInterface
      const resp = await PaystackWebhook.process(payload)
      if (resp.status) {
        return this.httpResponse(response, 200, true, resp.message, resp.data)
      }
      return this.httpResponse(response, 500, false, 'Could not update', null)
    } catch (error) {
      if (error.status === 400) {
        throw new BadRequestException(error.message)
      }
      throw error
    }
  }
}
