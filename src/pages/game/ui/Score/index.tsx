import './index.css'

interface ScoreProps {
  value: number;
}

export function Score({value}: ScoreProps) {
  return <div className="score">
    <div className="score__title">
      Score:
    </div>
    <div className="score__value">
      {value}
    </div>
  </div>
}