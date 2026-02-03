import "../../styles/AttBtn.css";
import Loader from "../Spinner/Loader"
import { useTimeInOut } from "../../hooks/useTimeInOut";
import { useLunchInOut } from "../../hooks/useLunchInOut";
import { useBreakInOut } from "../../hooks/useBreakInOut";

function AttBtn({ userId, onAttendanceChange, reload }) {
  const {
    role,
    isTimedIn,
    handleTimeIn,
    handleTimeOut,
    onLeave,
    isInitializing,
    loadingAction,
    totalOJTHours
  } = useTimeInOut(userId, onAttendanceChange);

  const {
    canLunchOut,
    canLunchIn,
    handleLunchOut,
    handleLunchIn,
    lunchOutLoading,
    lunchInLoading,
  } = useLunchInOut(userId, reload, onAttendanceChange);

  const {
    canBreakOut,
    canBreakIn,
    handleBreakOut,
    handleBreakIn,
    breakOutLoading,
    breakInLoading,
  } = useBreakInOut(userId, reload, onAttendanceChange, isTimedIn);

  if (role === "ADMIN" || role === "SUPERVISOR") return null;

  return (
    <div className="att__carousel-wrapper">
      <div className="att__carousel">
        <div className="att__carousel-card">
          {isInitializing ? (
            <Loader loading />
          ) : totalOJTHours === null ? (
            <p className="att__hint">
              Please contact HR/Admin to update your OJT hours
            </p>
          ) : (
            <button className="att__btn-ti" onClick={handleTimeIn} disabled={isTimedIn || onLeave}>
              <span className="att__btn-content">
                {loadingAction && (
                  <span className="att__btn-spinner">
                    <Loader loading />
                  </span>
                )}
                <span className={`att__btn-text ${loadingAction ? "hidden" : ""}`}>
                  Time In
                </span>
              </span>
            </button>
          )}
        </div>

        <div className="att__carousel-card">
          <button className="att__btn-lo" onClick={handleLunchOut} disabled={!canLunchOut || onLeave}>
            <span className="att__btn-content">
              {lunchOutLoading && (
                <span className="att__btn-spinner">
                  <Loader loading />
                </span>
              )}
              <span className={`att__btn-text ${lunchOutLoading ? "hidden" : ""}`}>
                Out for Lunch
              </span>
            </span>
          </button>
        </div>

        <div className="att__carousel-card">
          <button className="att__btn-li" onClick={handleLunchIn} disabled={!canLunchIn || onLeave}>
            <span className="att__btn-content">
              {lunchInLoading && (
                <span className="att__btn-spinner">
                  <Loader loading />
                </span>
              )}
              <span className={`att__btn-text ${lunchInLoading ? "hidden" : ""}`}>
                Back from Lunch
              </span>
            </span>
          </button>
        </div>
        
        <div className="att__carousel-card">
          <button className="att__btn-lo" onClick={handleBreakOut} disabled={!canBreakOut || onLeave}>
            <span className="att__btn-content">
              {breakOutLoading && (
                <span className="att__btn-spinner"><Loader loading /></span>
              )}
              <span className={`att__btn-text ${breakOutLoading ? "hidden" : ""}`}>
                Out for Break
              </span>
            </span>
          </button>
        </div>

        <div className="att__carousel-card">
          <button className="att__btn-li" onClick={handleBreakIn} disabled={!canBreakIn || onLeave}>
            <span className="att__btn-content">
              {breakInLoading && (
                <span className="att__btn-spinner"><Loader loading /></span>
              )}
              <span className={`att__btn-text ${breakInLoading ? "hidden" : ""}`}>
                Back from Break
              </span>
            </span>
          </button>
        </div>

        <div className="att__carousel-card">
          <button className="att__btn-to" onClick={handleTimeOut} disabled={!isTimedIn || onLeave}>
            <span className="att__btn-content">
              {loadingAction && (
                <span className="att__btn-spinner">
                  <Loader loading />
                </span>
              )}
              <span className={`att__btn-text ${loadingAction ? "hidden" : ""}`}>
                Time Out
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AttBtn;
