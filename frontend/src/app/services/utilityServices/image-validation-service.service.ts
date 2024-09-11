import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ImageValidationService {

  constructor() { }

  validateImageDimensions(image: File): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      const reader = new FileReader();
      
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.onload = () => {
          const validDimensions =
            img.width >= 100 && img.width <= 300 &&
            img.height >= 100 && img.height <= 300;
            
          observer.next(validDimensions);
          observer.complete();
        };
        img.onerror = () => observer.error(false);
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => observer.error(false);
      
      reader.readAsDataURL(image);
    });
  }
  }
