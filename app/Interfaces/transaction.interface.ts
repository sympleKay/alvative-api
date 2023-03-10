export interface CreateTransactionInterface {
  amount: number
  userId: string
  reference: string
}

export interface UpdateTransactionStatusInterface {
  transactionId: string
  transactionRef: string
  userId: string
  status: 'pending' | 'failed' | 'success' | string
}

export interface GetUserTransactionInterface {
  userId: string
  status?: 'pending' | 'failed' | 'success'
}
