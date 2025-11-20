import React, { useEffect, useState } from 'react'
import '../styles/AttendanceTable.css'
import { dummyAttendance } from '../api/attendanceData.js'

export default function AttendanceTable() {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        setRecords(dummyAttendance.users);
    }, []);

    return (
        <div className='attendance-container'>
            <table>
                <thead>
                    <tr>
                        {records[0] && Object.keys(records[0]).map((col, i) => (
                            <th key={i}>{col}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {records.map((record, i) => (
                        <tr key={i}>
                            {Object.values(record).map((val, j) => (
                                <td key={j}>{val}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
