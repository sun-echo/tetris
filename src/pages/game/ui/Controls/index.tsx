import './index.css'


interface IControlsProps {
  handlers: {
    onUp: () => void,
    onDown: () => void,
    onLeft: () => void,
    onRight: () => void,
  }
}

export default function Controls({ handlers }: IControlsProps) {
  const { onDown, onLeft,  onRight, onUp } = handlers;

  return (
    <div className="buttons-container">
      <span className="material-icons" onClick={onLeft}>arrow_circle_left</span>
      <span className="material-icons" onClick={onRight}>arrow_circle_right</span>

      <div className="vertical-buttons">
        <span className="material-icons" onClick={onUp} >arrow_circle_up</span>   
        <span className="material-icons" onClick={onDown}>arrow_circle_down</span>   
      </div>
    </div>
  )
}
