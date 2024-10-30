import sample from 'lodash/sample';
import cloneDeep from 'lodash/cloneDeep';
import minBy from 'lodash/minBy'
import isEmpty from 'lodash/isEmpty'
import { Color, DefaultPoints, FieldIndexMap, GAME_FIELD_SIZE_X, GAME_FIELD_SIZE_Y, PREVIEW_SIZE, Shapes } from '../lib/constants';
import { Cell, Field, Point, Shape } from '../lib/types';

const getRandomColor = () => sample(Object.values(Color).filter(v => v !== Color.Black)) as Color;
const getRandomShape = () => Shapes[Shapes.length * Math.random() | 0];

function generateShape(): Shape {
  const shapeType = getRandomShape();
  return {
    type: shapeType,
    points: DefaultPoints[shapeType],
    color: getRandomColor(),
  };
}

function generateField(sizeX: number, sizeY: number) {
  const field: Field = {};
  for (let x = 0; x < sizeX; x++) {
    for (let y = 0; y < sizeY; y++) {
      const index = FieldIndexMap[x] + FieldIndexMap[y];
      field[index] = {
        x: x,
        y: y,
        color: Color.Black,
      };
    }
  }
  return field;
}

function generateGameField() {
  return generateField(
    GAME_FIELD_SIZE_X,
    GAME_FIELD_SIZE_Y
  );
}

function generatePreview() {
  return generateField(PREVIEW_SIZE, PREVIEW_SIZE);
}

function getFieldCells (field: Field, sizeX: number, sizeY: number) {
  const cells: Cell[] = [];

  if (isEmpty(field)) return cells;

  for (let y = sizeY - 1; y >= 0; y--) {
    for (let x = 0; x < sizeX; x++) {
      const index = getPointFieldIndex({ x, y });
      cells.push(field[index])
    }
  }

  return cells;
}


const getPreviewCells = (field: Field) => getFieldCells(
  field,
  PREVIEW_SIZE,
  PREVIEW_SIZE
)

const getGameFieldCells = (field: Field) => getFieldCells(
  field,
  GAME_FIELD_SIZE_X,
  GAME_FIELD_SIZE_Y
)

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
  shape.points.some(
    p => occupiedCells.some(c => c.x === p.x && c.y === p.y)
  )
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

function moveXY(shape: Shape, offsetX: number, offsetY: number) {
  return moveY(moveX(shape, offsetX), offsetY)
}

const getBorderPoints = (points: Point[]) => {
  const xValues = points.map(p => p.x);
  const yValues = points.map(p => p.y);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  return {
    minX,
    maxX,
    minY,
    maxY
  }
}

function fixPosition(shape: Shape) {
  if (!shape) return shape;

  const { points } = shape;

  const {
    minX,
    maxX,
    minY,
    maxY
  } = getBorderPoints(points);

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
  
  return moveXY(shape, deltaX, deltaY);
};

const normalizeShape = (shape?: Shape) => {
  if (!shape) return shape;

  const minX = minBy(shape.points, p => p.x)?.x;
  const minY = minBy(shape.points, p => p.y)?.y;

  if (!minX || !minY) {
    return shape;
  }

  return {
    ...shape,
    points: shape.points.map(p => ({
      x: p.x - minX,
      y: p.y - minY
    }))
  }
}

const getRotatedPoints = (shape: Shape) => {
  const { type, points } = shape;
  const { x, y } = points[0];

  const {
    minX,
    maxX,
    minY,
    maxY
  } = getBorderPoints(points);

  const deltaX = maxX - minX;

  if (type === 'I') {
    if (x === points[1].x) {
      return [
        { x: x - 2, y: y - 1 },
        { x: x - 1, y: y - 1 },
        { x: x, y: y - 1 },
        { x: x + 1, y: y - 1 }
      ];
    } else {
      return [
        { x: x + 2, y: y + 1 },
        { x: x + 2, y: y },
        { x: x + 2, y: y - 1 },
        { x: x + 2, y: y - 2 }
      ];
    }
  } else if (type === 'S') {
    if (deltaX === 2) {
      return [
        { x: x, y: y + 2 },
        { x: x, y: y + 1},
        { x: x + 1, y: y + 1 },
        { x: x + 1, y: y }
      ];
    } else {
      return [
        { x: x, y: y - 2 },
        { x: x + 1, y: y - 2 },
        { x: x + 1, y: y - 1 },
        { x: x + 2, y: y - 1 }
      ];
    }
  } else if (type === 'Z') {
    if (deltaX === 2) {
      return [
        { x: x + 2, y: y + 1 },
        { x: x + 2, y: y },
        { x: x + 1, y: y },
        { x: x + 1, y: y - 1 }
      ];
    } else {
      return [
        { x: x - 2, y: y - 1 },
        { x: x - 1, y: y - 1 },
        { x: x - 1, y: y - 2 },
        { x: x, y: y - 2 }
      ];
    }
  } else if (type === 'L') {
    if (x === maxX && y === minY) {
      return [
        { x: x - 2, y: y + 1 },
        { x: x - 2, y: y + 2 },
        { x: x - 1, y: y + 2 },
        { x: x, y: y + 2 }
      ]
    } else if (x === minX && y === minY) {
      return [
        { x: x, y: y + 1 },
        { x: x + 1, y: y + 1 },
        { x: x + 1, y: y },
        { x: x + 1, y: y - 1 }
      ]
    } else if (x === minX && y === maxY) {
      return [
        { x: x + 2, y: y - 1 },
        { x: x + 2, y: y - 2 },
        { x: x + 1, y: y - 2 },
        { x: x, y: y - 2 }
      ]
    } else if (x === maxX && y === maxY) {
      return [
        { x: x, y: y - 1 },
        { x: x - 1, y: y - 1 },
        { x: x - 1, y: y },
        { x: x - 1, y: y + 1 }
      ]
    }
  } else if (type === 'J') {
    if (x === minX && y === minY) {
      return [
        { x: x, y: y + 1 },
        { x: x, y: y },
        { x: x + 1, y: y },
        { x: x + 2, y: y }
      ]
    } else if (x === minX && y === maxY) {
      return [
        { x: x + 2, y: y + 1 },
        { x: x + 1, y: y + 1 },
        { x: x + 1, y: y },
        { x: x + 1, y: y - 1 }
      ]
    } else if (x === maxX && y === maxY) {
      return [
        { x: x, y: y - 1 },
        { x: x , y: y },
        { x: x - 1, y: y },
        { x: x - 2, y: y }
      ]
    } else if (x === maxX && y === minY) {
      return [
        { x: x - 2, y: y - 1 },
        { x: x - 1, y: y - 1 },
        { x: x - 1, y: y },
        { x: x - 1, y: y + 1 }
      ]
    }
  } else if (type === 'T') {
    if (y === minY) {
      return [
        { x: x - 1, y: y + 1 },
        { x: x, y: y },
        { x: x, y: y + 1 },
        { x: x, y: y + 2 }
      ]
    } else if (x === minX) {
      return [
        { x: x + 1, y: y + 1 },
        { x: x, y: y },
        { x: x + 1, y: y },
        { x: x + 2, y: y }
      ]
    } else if (y === maxY) {
      return [
        { x: x + 1, y: y - 1 },
        { x: x , y: y },
        { x: x, y: y - 1 },
        { x: x, y: y - 2 }
      ]
    } else if (x === maxX) {
      return [
        { x: x - 1, y: y - 1 },
        { x: x, y: y },
        { x: x - 1, y: y },
        { x: x - 2, y: y }
      ]
    }
  }

  return points;
}

function rotateShape(shape: Shape) {
  if (!shape) return shape

  return {
    ...shape,
    points: getRotatedPoints(shape)
  }
}

const rotateAndPlace = (shape: Shape) =>
  fixPosition(rotateShape(shape))

export {
  moveX,
  moveY,
  isCollision,
  normalizeShape,
  getPreviewCells,
  getGameFieldCells,
  rotateAndPlace,
  generateShape,
  generatePreview,
  generateGameField,
  placeShapeOnField,
  getPointFieldIndex,
}
