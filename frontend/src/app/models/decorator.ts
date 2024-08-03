import { Address } from "../interfaces/address"

export class Decorator {
    _id: string = ''
    username: string = ''
    email: string = ''
    role: string = ''
    firstname: string = ''
    lastname: string = ''
    gender: string = ''
    address: Address = {street: '', number: '', city: ''}
    phoneNumber: string = ''
    profilePhoto: string = ''
    firm: string = ''
}