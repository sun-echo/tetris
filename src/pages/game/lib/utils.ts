import sample from 'lodash/sample';
import cloneDeep from 'lodash/cloneDeep';
import { Color, DefaultPoints, FieldIndexMap, Shapes } from '../lib/constants';
import { Field, Point, Shape } from '../lib/types';

const getRandomColor = () => sample(Object.values(Color).filter(v => v !== Color.Black)) as Color;
const getRandomShape = () => Shapes[Shapes.length * Math.random() | 0];

function generateField() {
  const _field: Field = {};

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 20; y++) {
      const index = FieldIndexMap[x] + FieldIndexMap[y];
      _field[index] = {
        x: x,
        y: y,
        color: Color.Black,
      };
    }
  }

  return _field;
}

function generateTetramino() {
  const shapeType = getRandomShape();
  const tetramino: Shape = {
    type: shapeType,
    points: DefaultPoints[shapeType],
    color: getRandomColor(),
  }

  return tetramino;
}

function getPointFieldIndex(point: Point) {
  const { x, y } = point;
  const _x = x < 10 ? `0${x}` : `${x}`;
  const _y = y < 10 ? `0${y}` : `${y}`;

  return _x + _y;
}

function placeShapeOnField(field: Field, shape?: Shape) {
  if (!shape) {
    return field
  }

  const _field = cloneDeep(field);

  const { points, color } = shape;

  for (const point of points) {
    const { x, y } = point;

    if (x <= 9 && y <= 19) {
      const index = getPointFieldIndex(point)
      console.log('debug changing index', index, x, y, _field[index], {
        x, y, color
      })
      _field[index] = {
        x, y, color
      };
    }
  }

  return _field;
}

function rotateShape(shape?: Shape) {
  if (!shape) {
    return shape
  }
  const { type, points } = shape;
  const { x, y } = points[0];

  if (type === 'O') {
    return shape
  }
  if (type === 'I') {
    if (x === points[1].x) {
      return {
        ...shape,
        points: [
          { x: x - 2, y: y - 1 },
          { x: x - 1, y: y - 1 },
          { x: x, y: y - 1 },
          { x: x + 1, y: y - 1 }
        ]
      }
    } else {
      return {
        ...shape,
        points: [
          { x: x + 2, y: y + 1 },
          { x: x + 2, y: y },
          { x: x + 2, y: y - 1 },
          { x: x + 2, y: y - 2 }
        ]
      }
    }
  }
  if (type === 'S') {
    return shape
  }
  if (type === 'Z') {
    return shape
  }
  if (type === 'L') {
    return shape
  }
  if (type === 'J') {
    return shape
  }
  if (type === 'T') {
    return shape
  }
}

export {
  generateField,
  generateTetramino,
  placeShapeOnField,
  getPointFieldIndex,
  rotateShape,
}
