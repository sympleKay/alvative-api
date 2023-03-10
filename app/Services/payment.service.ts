import { ServiceResponse } from 'App/Interfaces/service.interface'
import Transaction from 'App/Models/Transaction'
import User from 'App/Models/User'
import { PaystackService } from './providers/paystack.provider'
import { TransactionService } from './transaction.service'

export class PaymentService {
  public static async initialize(userId: string, amount: number): Promise<ServiceResponse> {
    try {
      const resp = await PaystackService.initializePaymentTransaction(amount, userId)
      return {
        status: true,
        message: 'Payment initialized successfully',
        data: resp,
      }
    } catch (error) {
      throw error
    }
  }

  public static async getBanks(): Promise<ServiceResponse> {
    try {
      const banks = await PaystackService.getBankAndCodes()
      return {
        status: true,
        message: 'Banks retrieved',
        data: banks,
      }
    } catch (error) {
      throw error
    }
  }

  public static async verifyAccountDetails(
    bankCode: string,
    accountNumber: string
  ): Promise<ServiceResponse> {
    try {
      const resp = await PaystackService.queryAccountNumber(bankCode, accountNumber)
      return {
        status: true,
        message: 'Account verification',
        data: resp,
      }
    } catch (error) {
      throw error
    }
  }

  public static async verifyTransaction(
    userId: string,
    reference: string
  ): Promise<ServiceResponse> {
    try {
      const user = await User.query().where('id', userId).firstOrFail()
      const refTrx = await Transaction.query()
        .where('user_id', user.id)
        .andWhere('reference', reference)
        .firstOrFail()
      const transactionStatus = await PaystackService.verifyPaymentTransaction(reference)

      await TransactionService.updateTransactionStatus({
        userId: user.id,
        status: transactionStatus.data.data.status,
        transactionRef: reference,
        transactionId: refTrx.id,
      })

      return {
        status: true,
        message: 'Payment verified successfully',
        data: transactionStatus.data.data,
      }
    } catch (error) {
      throw error
    }
  }
}
