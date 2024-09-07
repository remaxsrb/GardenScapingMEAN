import { Service } from '../interfaces/service';
import { Garden } from './garden';

export class Booking {
  _id: string = '';
  owner: string = '';
  decorator: string = '';
  firm: string = '';
  bookingDate: Date | string = new Date();
  startDate: Date | string = new Date();
  finishDate: Date | string = new Date();
  garden: Garden = new Garden();
  photo: string = '';
  services: Service[] = [];
  requests: string = '';
  status: string = 'active';
}
