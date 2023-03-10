import { ResponseContract } from '@ioc:Adonis/Core/Response'
import { DateTime } from 'luxon'

export class Utils {
  /**
   * Generates an alphanumeric string of 11 characters.
   */
  public static randomAlpha() {
    const string = Math.random().toString(36).substring(2, 15)

    return String(string)
  }

  /**
   * Generates a n-digit random number.
   */
  public static randomNumber(n: number) {
    const number = Math.random()
      .toString()
      .substring(2, n + 2)

    return number
  }

  /**
   * Generates a random number between zero and a given number n.
   * @param number
   * @returns
   */
  public static randomGivenNumber(number: number): number {
    const randomNumber = Math.floor(Math.random() * number)

    return Number(randomNumber)
  }

  /**
   * Global API reponse for headwork
   * @param response
   * @param httpCode
   * @param status
   * @param message
   * @param data
   * @returns
   */
  public static httpResponse(
    response: ResponseContract,
    httpCode: number,
    status: boolean,
    message: string,
    data?: unknown
  ) {
    return response.status(httpCode).json({
      status,
      message,
      data: data && data,
    })
  }

  public static generateTransactionRef(): string {
    const ref = `alt_${DateTime.now().get('month')}${DateTime.now().get(
      'day'
    )}_${this.randomAlpha()}_${this.randomNumber(4)}`

    return ref
  }
}
