import './index.css'

interface IScoreProps {
  value: number;
}

export function Score({value}: IScoreProps) {
  return <div className="score">
    <div className="score__title">
      Score:
    </div>
    <div className="score__value">
      {value}
    </div>
  </div>
}