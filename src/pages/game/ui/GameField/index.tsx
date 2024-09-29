import { Cell } from "../../lib/types";
import FieldCell from "../FieldCell";

import './index.css'

interface IGameFieldProps {
  cells: Cell[];
  gameOver: boolean;
}

export function GameField({ cells, gameOver }: IGameFieldProps) {
  return (
    <div className="game-field">
      {cells.map((cell, index) => (
        <FieldCell
          key={index}
          cell={cell}
        />
      ))}

      {gameOver && (
        <div className="game-over">
          Game Over!
        </div>
      )}
    </div>
  )
}