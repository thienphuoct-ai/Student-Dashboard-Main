'use client';

import React from 'react';

export default function ExamPage() {
  return (
    <main>
      <div 
        className="exam timetable" 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          height: '80vh',
          width: '80%',
          margin: 'auto'
        }}
      >
        <h2>Exam Available</h2>
        <table>
          <thead>
            <tr>
              <th>Ngày </th>
              <th>Thời gian</th>
              <th>Mã môn học</th>
              <th>phòng học</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>13 May 2026</td>
              <td>09-12 AM</td>
              <td>CS200</td>
              <td>38-718</td>
            </tr>
            <tr>
              <td>16 May 2026</td>
              <td>09-12 AM</td>
              <td>DBMS130</td>
              <td>38-718</td>
            </tr>
            <tr>
              <td>18 May 2026</td>
              <td>09-12 AM</td>
              <td>MTH166</td>
              <td>38-718</td>
            </tr>
            <tr>
              <td>20 May 2026</td>
              <td>09-12 AM</td>
              <td>NS200</td>
              <td>38-718</td>
            </tr>
            <tr>
              <td>23 May 2026</td>
              <td>09-12 AM</td>
              <td>CS849</td>
              <td>38-718</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}