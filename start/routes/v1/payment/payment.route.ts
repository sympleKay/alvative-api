import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/initialize', 'PaymentsController.initialize')
  Route.get('/verify-transaction', 'PaymentsController.verifyTransaction')
  Route.get('/banks', 'PaymentsController.getBanks')
  Route.post('/verify-bank', 'PaymentsController.verifyBankDetail')
})
  .prefix('/api/v1/payment')
  .middleware(['auth'])
  .namespace('App/Controllers/Http')
