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
      _field[index] = {
        x, y, color
      };
    }
  }

  return _field;
}

const isCollision = (shape: Shape, occupiedCells: Point[]) => (
  shape.points.some(p => occupiedCells.some(c => c.x === p.x && c.y === p.y))
)

function moveX(shape: Shape, offset: number) {
  if (offset === 0) {
    return shape
  }

  const _shape = cloneDeep(shape);

  _shape?.points.forEach((p, i) => {
    _shape.points[i] = {
      ...p,
      x: p.x + offset,
    }
  });

  return _shape;
}

function moveY(shape: Shape, offset: number) {
  if (offset === 0) {
    return shape
  }

  const _shape = cloneDeep(shape);

  _shape?.points.forEach((p, i) => {
    _shape.points[i] = {
      ...p,
      y: p.y + offset,
    }
  });

  return _shape;
} 

function fixPosition(shape?: Shape) {
  if (!shape) return shape;

  const { points } = shape;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  Object.values(points).forEach(v => {
    const { x, y } = v;
    if (x < minX) {
      minX = x;
    } else if (x > maxX) {
      maxX = x;
    }
    if (y < minY) {
      minY = y;
    } else if (y > maxY) {
      maxY = y;
    }
  });

  let deltaX = 0;
  let deltaY = 0;

  if (minX < 0) {
    deltaX = -minX
  } else if (maxX > 9) {
    deltaX = 9 - maxX
  }

  if (minY < 0) {
    deltaY = -minY
  } else if (maxY > 19) {
    deltaY = 19 - maxY
  }

  if (!deltaX && !deltaY) {
    return shape;
  }
  
  return moveX(moveY(shape, deltaY), deltaX);
};

/**
 * TODO:
 * - Implement mapping for all shapes
 * - Prevent collisions w/ other shapes
 */
function rotateShape(shape?: Shape) {
  if (!shape) {
    return shape
  }

  const { type, points } = shape;
  const { x, y } = points[0];

  if (type === 'O') {
    return shape;
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
      };
    } else {
      return {
        ...shape,
        points: [
          { x: x + 2, y: y + 1 },
          { x: x + 2, y: y },
          { x: x + 2, y: y - 1 },
          { x: x + 2, y: y - 2 }
        ]
      };
    }
  }

  if (type === 'S') {
    const xValues = points.map(p => p.x);
    const deltaX = Math.max(...xValues) - Math.min(...xValues);

    if (deltaX === 2) {
      return {
        ...shape,
        points: [
          { x: x, y: y + 2 },
          { x: x, y: y + 1},
          { x: x + 1, y: y + 1 },
          { x: x + 1, y: y }
        ]
      };
    } else {
      return {
        ...shape,
        points: [
          { x: x, y: y - 2 },
          { x: x + 1, y: y - 2 },
          { x: x + 1, y: y - 1 },
          { x: x + 2, y: y - 1 }
        ]
      };
    }
  }

  if (type === 'Z') {
    const xValues = points.map(p => p.x);
    const deltaX = Math.max(...xValues) - Math.min(...xValues);

    if (deltaX === 2) {
      return {
        ...shape,
        points: [
          { x: x + 2, y: y + 1 },
          { x: x + 2, y: y },
          { x: x + 1, y: y },
          { x: x + 1, y: y - 1 }
        ]
      };
    } else {
      return {
        ...shape,
        points: [
          { x: x - 2, y: y - 1 },
          { x: x - 1, y: y - 1 },
          { x: x - 1, y: y - 2 },
          { x: x, y: y - 2 }
        ]
      };
    }
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

const rotateAndPlace = (shape?: Shape) =>
  fixPosition(rotateShape(shape))

export {
  generateField,
  generateTetramino,
  placeShapeOnField,
  getPointFieldIndex,
  moveX,
  moveY,
  isCollision,
  rotateAndPlace
}
