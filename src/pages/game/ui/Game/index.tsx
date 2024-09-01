import { useCallback, useEffect, useMemo, useState } from 'react'
import FieldCell from '../FieldCell'
import { Cell, Field, Shape } from '../../lib/types';
import {
  generateShape,
  getPointFieldIndex,
  isCollision,
  moveX,
  moveY,
  placeShapeOnField,
  rotateAndPlace
} from '../../lib/utils';
import {  cloneDeep, isEmpty } from 'lodash';
import { Color, DefaultField, TICKRATE } from '../../lib/constants';
import './index.css'

/**
 * TODO:
 * Fix sizes
 * Fix eslint & prettier
 */

function Game() {
  const [field, setField] = useState<Field>({});
  const [currentShape, setCurrentShape] = useState<Shape>();
  const [gameOver, setGameOver] = useState(false);

  const fieldSnapshot = useMemo(
    () => placeShapeOnField(field, currentShape),
    [field, currentShape]
  );

  const occupiedCells = useMemo(
    () => Object.values(field).filter((v) => v.color !== Color.Black),
    [field]
  )

  const cells = useMemo(() => {
    const _cells: Cell[] = [];

    if (isEmpty(fieldSnapshot)) return _cells;

    for (let y = 19; y >= 0; y--) {
      for (let x = 0; x < 10; x++) {
        const index = getPointFieldIndex({ x, y });
        _cells.push(fieldSnapshot[index])
      }
    }

    return _cells;
  }, [fieldSnapshot]);

  const isShapeDropped = useCallback((shape?: Shape) => (
    shape?.points.some(p => p.y <= 0) ||
    occupiedCells.some(
      cell =>
        shape?.points.some(p => p.y === cell.y + 1 && p.x === cell.x)
    )
  ), [occupiedCells]);

  const clearFullLines = useCallback(() => {
    const yValues = occupiedCells.map(p => p.y);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    for (let line = minY; line <= maxY; line++) {
      if (occupiedCells.filter(p => p.y === line).length === 10) {
        const _field = cloneDeep(field);
        occupiedCells.forEach(p => {
          const { x, y } = p;
          if (y >= line) {
            const index = getPointFieldIndex({ x, y });
            const upperIndex = getPointFieldIndex({ x, y: y + 1 });
            _field[index].color = _field[upperIndex].color;
          }
        })
        setField(_field);
      }
    }
  }, [field, occupiedCells])

  useEffect(() => {
    clearFullLines();
  }, [clearFullLines])

  const handleMoveDown = useCallback(() => {
    setCurrentShape(shape => {
      if (!shape) return shape;

      if (!isShapeDropped(shape)) {
        return moveY(shape, -1);
      }

      setField(placeShapeOnField(field, shape));
      
      let _shape = generateShape();
 
      if (isShapeDropped(_shape)) {
        setGameOver(true);
      }

      return _shape
    })
  }, [isShapeDropped, field])

  const handleMoveLeft = useCallback(() => {
    setCurrentShape(shape => {
      if (!shape) return;
      
      const movedShape = moveX(shape, -1);
      const collision = isCollision(movedShape, occupiedCells);

      const noSpace = collision || shape?.points.some(p => p.x === 0);

      if (!shape || noSpace) {
        return shape;
      }

      return movedShape;
    })
  }, [occupiedCells])

  const handleMoveRight = useCallback(() => {
    setCurrentShape(shape => {
      if (!shape) return;
      
      const movedShape = moveX(shape, 1);
      const collision = isCollision(movedShape, occupiedCells);

      const noSpace = collision || shape?.points.some(p => p.x === 9);

      if (!shape || noSpace) {
        return shape;
      }

      return movedShape;
    })
  }, [occupiedCells]);

  const handleRotate = useCallback(() => {
    setCurrentShape(shape => {
      const rotatedShape = rotateAndPlace(shape);
      const collision = rotatedShape && isCollision(rotatedShape, occupiedCells);

      if (collision) {
        return shape;
      }

      return rotatedShape;
    })
  }, [occupiedCells]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (gameOver) {
      removeEventListener("keydown", handleKeyDown);
      return;
    }

    if (event.code === 'ArrowDown') {
      handleMoveDown();
    }
    if (event.code === 'ArrowLeft') {
      handleMoveLeft();
    }
    if (event.code === 'ArrowUp') {
      handleRotate();
    }
    if (event.code === 'ArrowRight') {
      handleMoveRight();
    }
  }, [gameOver, handleMoveDown, handleMoveLeft, handleMoveRight]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (gameOver) return
      handleMoveDown();
    }, TICKRATE);

    addEventListener("keydown", handleKeyDown);
    
    return () => {
      clearInterval(timer);
      removeEventListener("keydown", handleKeyDown);
    }
  }, [gameOver, handleKeyDown, handleMoveDown])

  const init = useCallback(() => {
    const shape = generateShape();
    setCurrentShape(shape);
    setField(DefaultField);
  }, []);

  useEffect(() => {
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="game-field">
        {cells.map((cell, index) => (
          <FieldCell key={index} cell={cell} />
        ))}

        {gameOver && (<div className="game-over">
          Game Over!
        </div>)}
      </div>
    </>
  )
}

export default Game
