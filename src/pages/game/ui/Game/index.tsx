import { useCallback, useEffect, useMemo, useState } from 'react'
import FieldCell from '../FieldCell'
import { Cell, Field, Shape } from '../../lib/types';
import { generateField, generateTetramino, getPointFieldIndex, placeShapeOnField } from '../../lib/utils';
import { cloneDeep, isEmpty } from 'lodash';
import './index.css'

function Game() {
  const [field, setField] = useState<Field>({});
  const [currentShape, setCurrentShape] = useState<Shape>();
  const [timer, setTimer] = useState<number>();

  useEffect(() => {
    console.log('debug currentSHape', currentShape)
  }, [currentShape])

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
  }, [field]);


  // const initTimer = useCallback(() => {
  //   const handler = () => {
  //     console.log('tick', currentShape)
  //     const shape = cloneDeep(currentShape);
  //     shape?.points.forEach((p, i) => {
  //       console.log('points', p, i)
  //       shape.points[i] = {
  //         ...p,
  //         y: p.y - 1,
  //       }
  //     })
  //   }
  //   const _timer = setInterval(handler, 1000);
  //   console.log('debug new timer', _timer)
  //   setTimer(_timer);
  // }, [currentShape])

  const render = useCallback(() => {
    console.log('tick', currentShape)
    const shape = cloneDeep(currentShape);
    shape?.points.forEach((p, i) => {
      console.log('points', p, i)
      shape.points[i] = {
        ...p,
        y: p.y - 1,
      }
    })
  }, [currentShape])

  const clearTimer = useCallback(() => {
    clearInterval(timer);
    setTimer(undefined);
  }, [timer, setTimer]);

  useEffect(() => {
    const _timer = setInterval(render, 1000);
    setTimer(_timer);
    return () => clearTimer();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const init = useCallback(() => {
    const shape = generateTetramino();
    console.log('debug setCurrentShape', shape)
    setCurrentShape(shape);
    setField(placeShapeOnField(generateField(), shape));
    // initTimer();
  }, []);

  useEffect(() => {
    init();
    console.log('init');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useEffect(() => () => {
  //   clearTimer();
  //   console.log('unmount');
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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
