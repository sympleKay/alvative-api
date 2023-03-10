import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/login', 'AuthController.loginUser')
  Route.get('/user', 'AuthController.user').middleware(['auth'])
})
  .prefix('/api/v1/auth')
  .namespace('App/Controllers/Http')
