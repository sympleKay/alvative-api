import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/initialize', 'PaymentsController.initialize').middleware(['auth'])
  Route.get('/verify-transaction', 'PaymentsController.verifyTransaction').middleware(['auth'])
  Route.get('/banks', 'PaymentsController.getBanks').middleware(['auth'])
  Route.post('/verify-bank', 'PaymentsController.verifyBankDetail').middleware(['auth'])
  Route.post('/webhook', 'PaymentsController.webhookEvent')
})
  .prefix('/api/v1/payment')
  .namespace('App/Controllers/Http')
