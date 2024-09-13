import { Injectable } from '@angular/core';
import { Shape } from 'src/app/interfaces/shape';

@Injectable({
  providedIn: 'root',
})
export class DrawShapesService {
  constructor() {}

  drawShapeOnCanvas(
    context: CanvasRenderingContext2D,
    shape: Shape,
    x: number,
    y: number,
    presentShapes: Shape[]
  ): void {
    // Check if the shape overlaps with any existing shapes

    context.fillStyle = shape.color;

    if (shape.type === 'rectangle') {
      context.fillRect(x, y, shape.width, shape.height);
    } else if (shape.type === 'circle') {
      context.beginPath();
      context.arc(
        x + shape.width / 2,
        y + shape.height / 2,
        shape.width / 2,
        0,
        Math.PI * 2
      );
      context.fill();
    } else if (shape.type === 'ellipse') {
      context.beginPath();
      context.ellipse(
        x + shape.width / 2,
        y + shape.height / 2,
        shape.width / 2,
        shape.height / 2,
        0,
        0,
        Math.PI * 2
      );
      context.fill();
    }
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
