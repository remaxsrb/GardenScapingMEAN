import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawShapesService {

  constructor() { }

  drawShape(
    event: DragEvent,
    shapes: any[],
    canvasId: string = 'gardenCanvas'
  ): any[] {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx || !event.dataTransfer) return shapes;

    const imageSrc = event.dataTransfer.getData('text/plain');
    const img = new Image();
    img.src = imageSrc;

    const dropX = event.offsetX;
    const dropY = event.offsetY;

    img.onload = () => {
      const shapeWidth = img.naturalWidth; 
      const shapeHeight = img.naturalHeight; 

      // Use isOverlapping method to check if there is an overlap
      const isOverlapping = this.isOverlapping(dropX, dropY, shapeWidth, shapeHeight, shapes);

      if (isOverlapping) {
        alert('Shape cannot overlap with another shape!');
        return; // Prevent the shape from being drawn
      }

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
    };

    return shapes;
  }

  isOverlapping(dropX: number, dropY: number, shapeWidth: number, shapeHeight: number, shapes: any[]): boolean {
    return shapes.some(
      (shape) =>
        dropX < shape.x + shape.width &&
        dropX + shapeWidth > shape.x &&
        dropY < shape.y + shape.height &&
        dropY + shapeHeight > shape.y
    );
  }

}
