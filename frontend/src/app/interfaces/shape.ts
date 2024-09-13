export interface Shape {
  id: string;
  type: 'rectangle' | 'circle' | 'ellipse';
  color: string;
  x?: number; 
  y?: number; 
  width: number;
  height: number;
}