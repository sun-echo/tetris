
import { Cell } from '../../lib/types';
import './index.css'

interface FieldCellProps {
  cell: Cell;
}

export default function FieldCell(props: FieldCellProps) {
  const { cell } = props;
  const { x, y, color } = cell ?? {};

  return (
    <div
      className={`field-cell field-cell--${x}-${y}`}
      style={{ backgroundColor: color }}
    />
  )
}