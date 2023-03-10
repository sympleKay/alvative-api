import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TransactionEnum } from '../../app/Enums/transaction.enum'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.float('amount').notNullable()
      table.string('channel').notNullable()
      table.string('reference').notNullable()
      table.enum('status', Object.values(TransactionEnum)).notNullable().defaultTo('pending')
      table.uuid('user_id').references('users.id').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
