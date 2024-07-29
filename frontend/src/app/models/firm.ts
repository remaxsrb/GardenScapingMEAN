import { Address } from "../interfaces/address"
import { Service } from "../interfaces/service"
import { Vacation } from "../interfaces/vacation"


export class Firm { 
  _id: string = ''
  name: string = ''
  address: Address = {street: '', number: '', city: ''}
  phoneNUmber: string = ''
  reviewCount: number = 0
  rating: number = 0.0
  services: Service[] = []
  vacation: Vacation = {start: new Date(), end: new Date()}
}