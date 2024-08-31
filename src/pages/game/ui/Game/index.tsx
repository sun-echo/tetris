import { useCallback, useEffect, useMemo, useState } from 'react'
import FieldCell from '../FieldCell'
import { Cell, Field, Shape } from '../../lib/types';
import { generateTetramino, getPointFieldIndex, placeShapeOnField } from '../../lib/utils';
import { cloneDeep, isEmpty } from 'lodash';
import { Color, DefaultField, TICKRATE } from '../../lib/constants';
import './index.css'

/**
 * TODO:
 * Fix sizes
 * Implement other arrows handlers
 * Fix eslint & prettier
 */

function Game() {
  const [currentShape, setCurrentShape] = useState<Shape>();
  const [field, setField] = useState<Field>({});
  const [gameOver, setGameOver] = useState(false);

  const fieldSnapshot = useMemo(
    () => placeShapeOnField(field, currentShape),
    [field, currentShape]
  );

  const ocupiedCells = useMemo(
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

  const isShapeDropped = useCallback((shape?: Shape) => {
    return ocupiedCells.some(
      cell =>
        shape?.points.some(p => p.y === cell.y + 1 && p.x === cell.x)
    )
  }, [ocupiedCells])

  const handleMoveDown = useCallback(() => {
    setCurrentShape(shape => {
      const shapeLanded = isShapeDropped(shape);

      let _shape = cloneDeep(shape) as Shape;

      if (
        shape?.points.some(p => p.y === 0) ||
        shapeLanded
      ) {
        setField(field => placeShapeOnField(field, shape))
        _shape = generateTetramino();
        if (isShapeDropped(_shape)) {
          setGameOver(true);
        }
      } else {
        _shape?.points.forEach((p, i) => {
          _shape.points[i] = {
            ...p,
            y: p.y - 1,
          }
        })
      }

      return _shape
    })
  }, [isShapeDropped])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (gameOver) {
      removeEventListener("keydown", handleKeyDown);
      return;
    }

    if (event.code === 'ArrowDown') {
      handleMoveDown();
    }
    if (event.code === 'ArrowLeft') {
      console.log('debug handleKeyDown ArrowLeft', event);
    }
    if (event.code === 'ArrowUp') {
      console.log('debug handleKeyDown ArrowUp', event);
    }
    if (event.code === 'ArrowRight') {
      console.log('debug handleKeyDown ArrowRight', event);
    }
  }, [gameOver, handleMoveDown]);

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
  }, [currentShape, gameOver, handleKeyDown, handleMoveDown])

  const init = useCallback(() => {
    const shape = generateTetramino();
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
          <FieldCell key={index} cell={cell}/>
        ))}

        {gameOver && (<div className="game-over">
          Game Over!
        </div>)}
      </div>
    </>
  )
}

export default Game
