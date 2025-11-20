import React from 'react'
import AttendanceTable from '../components/AttendanceTable';
import '../styles/AttendanceTable.css'

function Timesheet() {
  return (
  <div>
    <div className='attendance-head'>
      <h1>Timesheet</h1>
    </div>
    <AttendanceTable />
  </div>
  )
}

export default Timesheet