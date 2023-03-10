import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import BadRequestException from 'App/Exceptions/BadRequestException'
import { ServiceResponse } from 'App/Interfaces/service.interface'
import User from 'App/Models/User'
export class UserService {
  public static async signIn(
    email: string,
    password: string,
    auth: AuthContract
  ): Promise<ServiceResponse> {
    try {
      const user = await User.findByOrFail('email', email)
      if (!user.isActive) throw new BadRequestException('Account suspended', 400, 'LOGIN_ERROR')

      if (user.deletedAt)
        throw new BadRequestException('Invalid email or password', 400, 'LOGIN_ERROR')

      const { token } = await auth.attempt(email, password, {
        expiresIn: '1 day',
      })

      return {
        status: true,
        message: 'Login Successful',
        data: { token },
      }
    } catch (error) {
      throw error
    }
  }

  public static async currentUser(id: string) {
    try {
      const user = await User.query().where('id', id).preload('userTransactions').firstOrFail()
      return {
        status: true,
        message: 'Current user details retrieved',
        data: this.buildUser(user),
      }
    } catch (error) {
      throw error
    }
  }

  private static buildUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      isActive: Boolean(user.isActive),
      transactions:
        user.userTransactions && user.userTransactions.length > 0
          ? user.userTransactions.map((trx) => {
              return {
                id: trx.id,
                amount: trx.amount,
                status: trx.status,
              }
            })
          : undefined,
    }
  }
}
