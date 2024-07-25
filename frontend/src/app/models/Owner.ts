import { Address } from "../interfaces/address"
import { creditCardNumber } from "../interfaces/creditcard"

export class Owner {
  _id: string = ''
  username: string = ''
  email: string = ''
  role: string = ''
  firstname: string = ''
  lastname: string = ''
  gender: string = ''
  address: Address = {street: '', number: '', city: ''}
  phoneNumber: string = ''
  creditCardNumber: creditCardNumber = {cardNumber: ''}
  profile_photo: string = ''
  status: string = ''
}