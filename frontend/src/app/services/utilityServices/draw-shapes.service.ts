import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DrawShapesService {
  constructor() {}

  drawShape(
    event: DragEvent,
    shapes: any[],
    canvasId: string = 'gardenCanvas'
  ): Promise<{ shapes: any[]; isOverlapping: boolean }> {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
  
    // Return immediately if context or dataTransfer is not available
    if (!ctx || !event.dataTransfer) return Promise.resolve({ shapes, isOverlapping: false });
  
    const imageSrc = event.dataTransfer.getData('text/plain');
    const img = new Image();
    img.src = imageSrc;
  
    const dropX = event.offsetX;
    const dropY = event.offsetY;
  
    return new Promise((resolve) => {
      img.onload = () => {
        const shapeWidth = img.naturalWidth;
        const shapeHeight = img.naturalHeight;
  
        // Check for overlap
        const isOverlapping = this.isOverlapping(
          dropX,
          dropY,
          shapeWidth,
          shapeHeight,
          shapes
        );
  
        if (!isOverlapping) {
          // Draw the image if it does not overlap
          ctx.drawImage(img, dropX, dropY, shapeWidth, shapeHeight);
  
          // Add the new shape to the shapes array
          shapes.push({
            x: dropX,
            y: dropY,
            width: shapeWidth,
            height: shapeHeight,
            imageSrc: imageSrc,
          });
        }
  
        // Resolve the promise with the updated shapes array and overlap status
        resolve({ shapes, isOverlapping });
      };
    });
  }
  
  

  isOverlapping(
    dropX: number,
    dropY: number,
    shapeWidth: number,
    shapeHeight: number,
    shapes: any[]
  ): boolean {
    return shapes.some(
      (shape) =>
        dropX < shape.x + shape.width &&
        dropX + shapeWidth > shape.x &&
        dropY < shape.y + shape.height &&
        dropY + shapeHeight > shape.y
    );
  }
}
