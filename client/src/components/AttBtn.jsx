import "../styles/AttBtn.css";
import { useTimeInOut } from "../hooks/useTimeInOut";
import { useLunchInOut } from "../hooks/useLunchInOut";

function AttBtn({ userId, onAttendanceChange, reload }) {
  const {
    role,
    isTimedIn,
    handleTimeIn,
    handleTimeOut,
    onLeave
  } = useTimeInOut(userId, onAttendanceChange);

  const {
    canLunchOut,
    canLunchIn,
    handleLunchOut,
    handleLunchIn
  } = useLunchInOut(userId, reload, onAttendanceChange);

  if (role === "ADMIN") return null;

  return (
    <div className="att__carousel-wrapper">
      <div className="att__carousel">

        <div className="att__carousel-card">
          <button
            className="att__btn-ti"
            onClick={handleTimeIn}
            disabled={isTimedIn || onLeave}
          >
            Time In
          </button>
        </div>

        <div className="att__carousel-card">
          <button
            className="att__btn-lo"
            onClick={handleLunchOut}
            disabled={!canLunchOut || onLeave}
          >
            Out for Lunch
          </button>
        </div>

        <div className="att__carousel-card">
          <button
            className="att__btn-li"
            onClick={handleLunchIn}
            disabled={!canLunchIn || onLeave}
          >
            Back from Lunch
          </button>
        </div>

        <div className="att__carousel-card">
          <button
            className="att__btn-to"
            onClick={handleTimeOut}
            disabled={!isTimedIn || onLeave}
          >
            Time Out
          </button>
        </div>

      </div>
    </div>
  );
}

export default AttBtn;
