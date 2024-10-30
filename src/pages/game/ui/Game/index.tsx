import Controls from '../Controls';
import { Score } from '../Score';
import { GameField } from '../GameField';
import { useGame } from './useGame';
import { ShapePreview } from '../ShapePreview';

import './index.css'


export function Game() {
  const {
    score,
    gameOver,
    nextShape,
    fieldCells,
    controlsHandlers
  } = useGame();

  return (
    <div className="tetris-container">
      <GameField
        cells={fieldCells}
        gameOver={gameOver}
      />

      <Score value={score} />

      <ShapePreview shape={nextShape} />

      <Controls handlers={controlsHandlers} />
    </div>
  )
}
