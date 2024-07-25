import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ImageValidationService {

  constructor() { }

  validateImageDimensions(image: File): Observable<boolean> {

    return new Observable((observer: Observer<boolean>) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const minWidth = 100;
          const minHeight = 100;
          const maxWidth = 300;
          const maxHeight = 300;

          const validDimensions =
            img.width >= minWidth &&
            img.width <= maxWidth &&
            img.height >= minHeight &&
            img.height <= maxHeight;

          if (!validDimensions) {
            // Optionally handle invalid dimensions behavior here
            // For example, reset selectedFile to null
            // this.selectedFile = null;
          }
          observer.next(validDimensions);
          observer.complete();
        };
        img.onerror = () => {
          observer.error(false);
        };
        img.src = e.target.result;
      };

      reader.onerror = () => {
        observer.error(false);
      };

      reader.readAsDataURL(image);
    });

}}
