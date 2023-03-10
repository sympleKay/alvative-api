import { ServiceResponse } from 'App/Interfaces/service.interface'
import {
  CreateTransactionInterface,
  GetUserTransactionInterface,
  UpdateTransactionStatusInterface,
} from 'App/Interfaces/transaction.interface'
import Transaction from 'App/Models/Transaction'

export class TransactionService {
  public static async create(payload: CreateTransactionInterface): Promise<ServiceResponse> {
    try {
      const transaction = await Transaction.create({
        amount: payload.amount,
        channel: 'paystack',
        status: 'pending',
        userId: payload.userId,
        reference: payload.reference,
      })
      return {
        status: true,
        message: 'Transaction added',
        data: transaction,
      }
    } catch (error) {
      throw error
    }
  }
  public static async updateTransactionStatus({
    userId,
    transactionId,
    transactionRef,
    status,
  }: UpdateTransactionStatusInterface): Promise<ServiceResponse> {
    try {
      const transaction = await Transaction.query()
        .where('id', transactionId)
        .andWhere('user_id', userId)
        .andWhere('reference', transactionRef)
        .firstOrFail()

      transaction.status = status

      await transaction.save()

      return {
        status: true,
        message: `Transaction status updated to ${status}`,
        data: transaction,
      }
    } catch (error) {
      throw error
    }
  }

  public static async getUserTransaction({
    userId,
    status,
  }: GetUserTransactionInterface): Promise<ServiceResponse> {
    try {
      if (status) {
        const transaction = await Transaction.query()
          .where('user_id', userId)
          .andWhere('status', status)
          .preload('user', (user) => {
            user.select('id', 'email', 'first_name', 'last_name')
          })
        return {
          status: true,
          message: `Transaction status updated to ${status}`,
          data: transaction,
        }
      }
      const transaction = await Transaction.query()
        .where('user_id', userId)
        .preload('user', (user) => {
          user.select('id', 'email', 'first_name', 'last_name')
        })
      return {
        status: true,
        message: `Transaction status updated to ${status}`,
        data: transaction,
      }
    } catch (error) {
      throw error
    }
  }
}
