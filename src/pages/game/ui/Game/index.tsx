import { useCallback, useEffect, useMemo, useState } from 'react'
import FieldCell from '../FieldCell'
import './index.css'
import { Cell, Field, Shape } from '../../lib/types';
import { generateField, generateTetramino, getPointFieldIndex, placeShapeOnField } from '../../lib/utils';
import './index.css'
import { isEmpty } from 'lodash';

function Game() {
  const [field, setField] = useState<Field>({});
  const [currentShape, setCurrentShape] = useState<Shape>();

  const cells = useMemo(() => {
    const _cells: Cell[] = [];

    if (isEmpty(field)) return _cells;

    for (let y = 19; y >= 0; y--) {
      for (let x = 0; x < 10; x++) {
        const index = getPointFieldIndex({ x, y });
        _cells.push(field[index])
      }
    }

    return _cells;
  }, [field])

  const init = useCallback(() => {
    const shape = generateTetramino();
    setCurrentShape(shape);
    setField(placeShapeOnField(generateField(), shape));
  }, []);

  useEffect(() => {
    return () => {
      init();
      console.log('init');
    }
  }, [init])

  useEffect(() => {
    console.log('debug currentShape', currentShape)
  }, [currentShape])

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
