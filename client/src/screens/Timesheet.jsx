import React from 'react'
import AttendanceTable from '../components/AttendanceTable';
import DashboardLayout from "../components/DashboardLayout/DashboardLayout";
import '../styles/AttendanceTable.css'
import '../styles/DateRange.css'

function Timesheet() {

  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

  return (
    <div>
      <DashboardLayout>
        <div className="daterange_bar">
          Date Range: {firstDay.toLocaleDateString()} - {lastDay.toLocaleDateString()} 
        </div>

        <div className='attendance-head'>
          <h1>Timesheet</h1>
        </div>

        <AttendanceTable />
      </DashboardLayout>
    </div>
  )
}

export default Timesheet