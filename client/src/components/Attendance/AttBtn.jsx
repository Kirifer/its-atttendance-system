import React from 'react'
import "../Attendance/AttBtn.css"

function AttBtn() {
    return (
    <div className="att__carousel-wrapper">
        <div className='att__carousel'>
            <div className='att__carousel-card'>
                <button className="att__btn-ti">Time In</button>
            </div>
            <div className='att__carousel-card'>
                <button className="att__btn-lo">Out for Lunch</button>
            </div>
            <div className='att__carousel-card'>
                <button className="att__btn-li">Back from Lunch</button>
            </div>
            <div className='att__carousel-card'>
                <button className="att__btn-to">Time Out</button>
            </div>
        </div>
    </div>
    )
}

export default AttBtn