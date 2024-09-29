import Controls from '../Controls';
import { Score } from '../Score';
import { GameField } from '../GameField';
import { useGame } from './useGame';

import './index.css'


export function Game() {
  const {
    score,
    gameOver,
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

      <Controls handlers={controlsHandlers} />
    </div>
  )
}
