import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  constructor() {}

  formatTimeTo24HourString(time: any) {
    // Extract hour and minute
    const hours = time.getUTCHours().toString().padStart(2, '0');
    const minutes = time.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  formatDateToDDMMYYYY(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  parseDateFromDDMMYY(dateStr: string) {
    let [day, month, year] = dateStr.split('.').map(Number);

    return new Date(year, month - 1, day);
}


  replaceDateWithStartUnixEpoch(time: any) {
    const unixEpoch = new Date('1970-01-01T00:00:00Z');

    // Extract the time components (hours, minutes, seconds, milliseconds) from the input date
    const hours = time.getUTCHours();
    const minutes = time.getUTCMinutes();

    // Set the time components to the Unix epoch date
    unixEpoch.setUTCHours(hours);
    unixEpoch.setUTCMinutes(minutes);

    // Return the modified date object as an ISO string
    return unixEpoch;
  }

  getDaysDifference(date1: Date, date2: Date) {
    const timestamp1 = new Date(date1).getTime();
    const timestamp2 = new Date(date2).getTime();

    const differenceMs = Math.abs(timestamp1 - timestamp2);

    return Math.floor(differenceMs / (1000 * 60 * 60 * 24));
  }
}
