import { useCallback, useEffect, useMemo, useState } from 'react'
import FieldCell from '../FieldCell'
import { Cell, Field, Shape } from '../../lib/types';
import { generateTetramino, getPointFieldIndex, placeShapeOnField } from '../../lib/utils';
import { cloneDeep, isEmpty } from 'lodash';
import './index.css'
import { Color, DefaultField } from '../../lib/constants';

function Game() {
  const [currentShape, setCurrentShape] = useState<Shape>();
  const [field, setField] = useState<Field>({});

  const fieldSnapshot = useMemo(
    () => placeShapeOnField(field, currentShape),
    [field, currentShape]
  );

  useEffect(() => {
    console.log('debug currentSHape', currentShape)
  }, [currentShape])

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

  // TODO: Add chech for shape landed on other shape
  const lowerShape = useCallback((shape?: Shape) => {
    console.log('debug low', shape, field, shape?.points.some(p => p.y === 0) ||
    Object.values(field).some(c => c.color !== Color.Black && shape?.points.some(p => p.y - c.y <= 1)))
    if (
      shape?.points.some(p => p.y === 0) ||
      Object.values(field).some(c => (
        c.color !== Color.Black &&
        shape?.points.some(p => p.y - c.y <= 1)
      ))
    ) {
      return;
    }
    const _shape = cloneDeep(shape);
    _shape?.points.forEach((p, i) => {
      _shape.points[i] = {
        ...p,
        y: p.y - 1,
      }
    })
    return _shape
  }, [field])

  const handleTick = useCallback(() => {
    setCurrentShape(shape => {
      let _shape = lowerShape(shape);
      if (shape && !_shape) {
        setField(field => placeShapeOnField(field, shape))
        _shape = generateTetramino();
        console.log('debug shape landed. new - ', _shape);
      }
      return _shape
    })
  }, [lowerShape])

  useEffect(() => {
    const timer = setInterval(() => {
      console.log('tick', currentShape);
      handleTick();
    }, 100)

    console.log('deb new timer', timer)
    
    return () => clearInterval(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const init = useCallback(() => {
    const shape = generateTetramino();
    console.log('debug setCurrentShape', shape)
    setCurrentShape(shape);
    setField(DefaultField);
  }, []);

  useEffect(() => {
    init();
    console.log('init');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="game-field">
        {cells.map((cell, index) => (
          <FieldCell key={index} cell={cell}/>
        ))}
      </div>
    </>
  )
}

export default Game
