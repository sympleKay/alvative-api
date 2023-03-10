import { DateTime } from 'luxon'

export interface BankListResponse {
  name: string
  slug: string
  code: string
  id: number
  country: string
}

export interface VerifyBankAccount {
  bankCode: string
  accountNumber: string
}
export interface VerifyBankAccountResponse {
  account_number: string
  account_name: string
  bank_id: string
}
export interface BankAccountDetailsResponse {
  bank_name: string
  bank_code: string
  account_name: string
  account_number: string
}

export interface InitializePaymentResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

export interface VerifyPaymentResponse {
  status: boolean
  message: string
  data: {
    id: string
    domain: string
    status: string
    reference: string
    amount: number
    gateway_response: string
    paid_at: string
    created_at: string
    channel: string
    currency: string
    ip_address: string
    authorization: {
      authorization_code: string
      bin: string
      last4: string
      exp_month: string
      exp_year: string
      channel: string
      card_type: string
      bank: string
      country_code: string
      brand: string
      reusable: boolean
      signature: string
      account_name: string
    }
    customer: {
      id: string
      first_name: string
      last_name: string
      email: string
      customer_code: string
      phone: string
    }
  }
}

export interface PaystackWebhookInterface {
  event: string
  data: {
    id: number
    domain: string
    status: string
    reference: string
    amount: number
    message: null | string
    gateway_response: string
    paid_at: DateTime
    created_at: DateTime
    channel: string
    currency: string
    ip_address: string
    metadata: object
    log: {
      time_spent: number
      attempts: number
      authentication: number
      errors: number
      success: boolean
      mobile: boolean
      input: []
      channel: null | string
      history: [
        {
          type: string
          message: string
          time: number
        },
        {
          type: string
          message: string
          time: string
        },
        {
          type: string
          message: string
          time: number
        }
      ]
    }
    fees: null | string
    customer: {
      id: number
      first_name: string
      last_name: string
      email: string
      customer_code: string
      phone: null | string
      metadata: null | object
      risk_action: string
    }
    authorization: {
      authorization_code: string
      bin: string
      last4: string
      exp_month: string
      exp_year: string
      card_type: string
      bank: string
      country_code: string
      brand: string
      account_name: string
    }
    plan: object
  }
}
