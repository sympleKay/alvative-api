import axios, { AxiosResponse } from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import {
  BankListResponse,
  InitializePaymentResponse,
  VerifyBankAccountResponse,
  VerifyPaymentResponse,
} from 'App/Interfaces/paystack.interface'
import User from 'App/Models/User'
import { Utils } from 'App/Utils/helper.util'
import { TransactionService } from '../transaction.service'

const BASE_URL = Env.get('PAYSTACK_BASE_URL')
const SECRET_KEY = Env.get('PAYSTACK_SECRET_KEY')

export class PaystackService {
  public static async getBankAndCodes() {
    try {
      const { data }: AxiosResponse = await axios({
        method: 'GET',
        url: '/bank?country=nigeria',
        baseURL: BASE_URL,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SECRET_KEY}`,
        },
      })

      const resp = data.data as BankListResponse[]
      const banks = resp.map((data) => {
        return {
          name: data.name,
          code: data.code,
          slug: data.slug,
        }
      })

      return banks
    } catch (error: any) {
      throw error
    }
  }
  public static async queryAccountNumber(bankCode: string, accountNumber: string) {
    try {
      const { data }: AxiosResponse = await axios({
        method: 'GET',
        baseURL: BASE_URL,
        url: `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
        },
      })
      const resp = data.data as VerifyBankAccountResponse
      return {
        accountName: resp.account_name,
        accountNumber: resp.account_number,
      }
    } catch (error: any) {
      throw error
    }
  }

  public static async initializePaymentTransaction(
    amount: number,
    userId: string,
    description?: string,
    transactionRef?: string
  ) {
    try {
      const user = await User.query().where('id', userId).firstOrFail()
      const ref = transactionRef || Utils.generateTransactionRef()
      const { data }: AxiosResponse = await axios({
        method: 'POST',
        baseURL: BASE_URL,
        url: '/transaction/initialize',
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
        },
        data: {
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phoneNumber,
          amount: String(amount * 100),
          currency: 'NGN',
          reference: ref,
          metadata: {
            userId: userId,
            description: description || `You received a sum of ${amount * 100} from ${user.email}`,
          },
        },
      })

      const resp = data as InitializePaymentResponse

      await TransactionService.create({
        amount,
        reference: ref,
        userId: user.id,
      })

      return {
        status: true,
        data: { ...resp, transactionRef },
      }
    } catch (error: any) {
      console.log(error)
      throw error
    }
  }

  public static async verifyPaymentTransaction(transactionRef: string) {
    try {
      const { data }: AxiosResponse = await axios({
        method: 'GET',
        baseURL: BASE_URL,
        url: `/transaction/verify/${transactionRef}`,
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
        },
      })
      const resp = data as VerifyPaymentResponse
      return {
        status: true,
        data: resp,
      }
    } catch (error: any) {
      throw error
    }
  }
}
