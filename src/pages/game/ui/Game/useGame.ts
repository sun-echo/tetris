import { useCallback, useEffect, useMemo, useState } from 'react'
import { Cell, Field, Shape } from '../../lib/types';
import {
  generateShape,
  getGameFieldCells,
  getPointFieldIndex,
  isCollision,
  moveX,
  moveY,
  placeShapeOnField,
  rotateAndPlace
} from '../../lib/utils';
import {  cloneDeep, isEmpty } from 'lodash';
import { Color, DefaultField, GAME_FIELD_SIZE_X, GAME_FIELD_SIZE_Y, PREVIEW_SIZE, TICKRATE } from '../../lib/constants';

/**
 * TODO:
 * - Fix eslint & prettier
 * - Implement next figure display
 * - Design game over message
 */

export function useGame() {
  const [field, setField] = useState<Field>(DefaultField);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState(false);
  const [nextShape, setNextShape] = useState<Shape>(generateShape());
  const [currentShape, setCurrentShape] = useState<Shape>(generateShape());

  const fieldSnapshot = useMemo(
    () => placeShapeOnField(field, currentShape),
    [field, currentShape]
  );

  const occupiedCells = useMemo(
    () => Object.values(field).filter((v) => v.color !== Color.Black),
    [field]
  )

  const fieldCells = useMemo(
    () => getGameFieldCells(fieldSnapshot),
    [fieldSnapshot]
  );

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

    let clearedLines: 0|1|2|3|4 = 0;

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
        clearedLines++;
      }
    }

    let reward = 0;

    if (clearedLines === 0) {
      reward = 0;
    } else if (clearedLines === 1) {
      reward = 100;
    } else if (clearedLines === 2) {
      reward = 300;
    } else if (clearedLines === 3) {
      reward = 700;
    } else if (clearedLines === 4) {
      reward = 1500;
    }

    setScore(score + reward);
  }, [field, occupiedCells, score])

  useEffect(() => {
    clearFullLines();
  }, [clearFullLines]);


  const handleMoveDown = useCallback(() => {
    setCurrentShape(shape => {
      if (!shape) return shape;

      if (!isShapeDropped(shape)) {
        return moveY(shape, -1);
      }

      setField(placeShapeOnField(field, shape));

      if (isShapeDropped(nextShape)) {
        setGameOver(true);
      }

      setNextShape(generateShape());

      return nextShape
    })
  }, [isShapeDropped, field])

  const handleMoveLeft = useCallback(() => {
    setCurrentShape(shape => {
      if (!shape) return shape;
      
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
      if (!shape) return shape;
      
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
      const collision =
        rotatedShape &&
        isCollision(rotatedShape, occupiedCells);

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

  const controlsHandlers = {
    onUp: handleRotate,
    onLeft: handleMoveLeft,
    onDown: handleMoveDown,
    onRight: handleMoveRight,
  }

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


  return {
    score,
    gameOver,
    nextShape,
    fieldCells,
    controlsHandlers,
  }
}
