import { useEffect, useMemo, useState } from 'react'
// import reactLogo from '../../../shared/assets/react.svg'
// import viteLogo from '/vite.svg'
import FieldCell from '../FieldCell'
import './index.css'
import { Color, FieldIndexMap } from '../../lib/constants';
import { Cell, Field, Shape } from '../../lib/types';
import { generateTetramino, getPointFieldIndex, placeShapeOnField } from '../../lib/utils';
import './index.css'
import { isEmpty } from 'lodash';

// TODO: Types
// type FieldKeyNumber = keyof typeof FieldKeysMap;
// type FieldKey = typeof FieldKeysMap[FieldKeyNumber]

function Game() {
  const [field, setField] = useState<Field>({});
  const [currentShape, setCurrentShape] = useState<Shape>();


  const cells = useMemo(() => {
    const _cells: Cell[] = [];

    if (isEmpty(field)) return _cells;

    for (let y = 19; y >= 0; y--) {
      for (let x = 0; x < 10; x++) {
        const index = getPointFieldIndex({ x, y });
        // console.log('debug calc cell', index, field)
        _cells.push(field[index])
      }
    }

    return _cells;
  }, [field])

  useEffect(() => {
    console.log('debug cells', cells);
  }, [cells])

  const init = () => {
    const newField: Field = {};
  
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 20; y++) {
        const index = FieldIndexMap[x] + FieldIndexMap[y];
        newField[index] = {
          x: x,
          y: y,
          color: Color.Black,
        };
      }
    }

    const shape = generateTetramino()
    setCurrentShape(shape);

    console.log('debug place', newField, shape, placeShapeOnField(newField, shape))
    setField(placeShapeOnField(newField, shape));
  }

  useEffect(() => {
    return () => {
      console.log('debug init')
      init();
    }
  }, [])

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
