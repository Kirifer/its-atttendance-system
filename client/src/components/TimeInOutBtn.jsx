import { useState } from 'react'
import "../styles/TimeInOut.css"
function TimeInOut() {

  const [isTimedIn, setIsTimedIn] = useState(false);

  const handleTimeIn = () => {
    alert("Timed in");
    setIsTimedIn(true);
  }

  const handleTimeOut = () => {
    alert("Timed out");
    setIsTimedIn(false);
  }

  return (
    <div className="tinout_body">
      <div className="tinout_container">
        <button id="in" className="tinout_in_btn" onClick={handleTimeIn} disabled={isTimedIn}>Time In</button>
        <button className="tinout_out_btn" onClick={handleTimeOut} disabled={!isTimedIn}>Time Out</button>
      </div>
    </div>
  )
}

export default TimeInOut;