import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TimeService {
  constructor() {}

  formatTimeTo24HourString(time: any) {
    // Extract hour and minute
    const hours = time.getUTCHours().toString().padStart(2, "0");
    const minutes = time.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  replaceDateWithStartUnixEpoch(time: any) {
    
    const unixEpoch = new Date("1970-01-01T00:00:00Z"); 

    // Extract the time components (hours, minutes, seconds, milliseconds) from the input date
    const hours = time.getUTCHours();
    const minutes = time.getUTCMinutes();


    // Set the time components to the Unix epoch date
    unixEpoch.setUTCHours(hours);
    unixEpoch.setUTCMinutes(minutes);

    // Return the modified date object as an ISO string
    return unixEpoch;
  }
}
