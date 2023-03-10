import { PaystackWebhookInterface } from 'App/Interfaces/paystack.interface'
import { ServiceResponse } from 'App/Interfaces/service.interface'
import Transaction from 'App/Models/Transaction'

export class PaystackWebhook {
  public static async process({ event, data }: PaystackWebhookInterface): Promise<ServiceResponse> {
    try {
      if (event !== 'charge.success') {
        throw new Error('Not a charge request')
      }
      const transaction = await Transaction.query().where('reference', data.reference).firstOrFail()
      transaction.status = data.status
      await transaction.save()
      return {
        status: true,
        message: `Transaction updated to ${data.status}`,
        data: {
          transactionId: data.reference,
          data,
        },
      }
    } catch (error) {
      throw error
    }
  }
}
