import { Address } from "../interfaces/address"

export class Owner {
  _id: string = ''
  username: string = ''
  email: string = ''
  role: string = ''
  firstname: string = ''
  lastname: string = ''
  gender: string = ''
  address: Address = {street: '', number: '', city: ''}
  phone_number: string = ''
  credit_card_number: string = ''
  profile_photo: string = ''
  status: string = ''
}