import { Shape } from "../interfaces/shape";

export class Garden {
    width: number = 1;
    height: number = 1;
    type: 'private' | 'restaurant' = 'private';
    waterArea: number = 1;
    greenArea : number = 1;
    sittingArea: number = 1;
    layout: Shape[] = []
    waterBodies: number = 0;
}