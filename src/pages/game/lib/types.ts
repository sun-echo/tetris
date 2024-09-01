import { Color, Shapes } from "./constants";


export interface Point {
  x: number;
  y: number;
}

export interface Cell extends Point {
  color: Color;
}

export interface Field {
  [key: string]: Cell;
}

export type ShapeType = typeof Shapes[number];

export interface Shape {
  type: ShapeType;
  points: Point[];
  color: Color;
}

