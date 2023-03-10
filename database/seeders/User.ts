import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await User.create({
      firstName: 'oluwakayode',
      lastName: 'fafiyebi',
      email: 'oluwakayodefafiyebi95@gmail.com',
      password: Env.get('USER_PASSWORD'),
      phoneNumber: '08131006516',
    })
  }
}
