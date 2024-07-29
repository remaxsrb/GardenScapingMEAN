import { Address } from "../interfaces/address"

export class User {
    _id: string = ''
    username: string = ''
    email: string = ''
    role: string = ''
    firstname: string = ''
    lastname: string = ''
    gender: string = ''
    address: Address = {street: '', number: '', city: ''}
    phoneNumber: string = ''
    creditCardNumber: string = ''
    profilePhoto: string = ''
    status: string = ''
}