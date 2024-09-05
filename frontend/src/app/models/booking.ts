import { Service } from "../interfaces/service";
import { Garden } from "./garden";

export class Booking {
    owner: string = '';
    firm: string = '';
    startDate: Date | string = new Date();
    finishDate: Date = new Date();
    garden: Garden = new Garden();
    photo: string = '';
    services: Service[] = [];
    requests: string = '';
    status: string = "active";
}