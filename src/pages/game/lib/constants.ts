import { generateField } from "./utils";

export const TICKRATE = 400;

export const FieldIndexMap: Record<number, string> = {
  0: '00',
  1: '01',
  2: '02',
  3: '03',
  4: '04',
  5: '05',
  6: '06',
  7: '07',
  8: '08',
  9: '09',
  10: '10',
  11: '11',
  12: '12',
  13: '13',
  14: '14',
  15: '15',
  16: '16',
  17: '17',
  18: '18',
  19: '19',
};

export enum Color {
  Red = 'red',
  Blue = 'blue',
  Green = 'green',
  Grey = 'grey',
  Black = 'black',
};

export const Shapes = ['O','I','S','Z','L','J','T'] as const;

export const DefaultPoints = {
  'O': [
    { x: 4, y: 19 },
    { x: 4, y: 20 },
    { x: 5, y: 19 },
    { x: 5, y: 20 },
  ],
  'I': [
    { x: 4, y: 19 },
    { x: 4, y: 20 },
    { x: 4, y: 21 },
    { x: 4, y: 22 },
  ],
  'S': [
    { x: 3, y: 19 },
    { x: 4, y: 19 },
    { x: 4, y: 20 },
    { x: 5, y: 20 },
  ],
  'Z': [
    { x: 3, y: 20 },
    { x: 4, y: 20 },
    { x: 4, y: 19 },
    { x: 5, y: 19 },
  ],
  'L': [
    { x: 5, y: 19 },
    { x: 4, y: 19 },
    { x: 4, y: 20 },
    { x: 4, y: 21 },
  ],
  'J': [
    { x: 4, y: 19 },
    { x: 5, y: 19 },
    { x: 5, y: 20 },
    { x: 5, y: 21 },
  ],
  'T': [
    { x: 4, y: 19 },
    { x: 3, y: 20 },
    { x: 4, y: 20 },
    { x: 5, y: 20 },
  ],
}

export const DefaultField = generateField();