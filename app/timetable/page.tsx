'use client';

import React, { useState } from 'react';  // bỏ useEffect
import { timetableData, dayNames } from '../constants';

export default function TimetablePage() {
  // ✅ Dùng lazy initializer: hàm trong useState() chỉ chạy 1 lần
  // tránh được cả lỗi ESLint lẫn hydration mismatch
  const [viewingDay, setViewingDay] = useState(() => {
    if (typeof window === 'undefined') return 0; // SSR safety
    return new Date().getDay();
  });

  const today = new Date().getDay();

  const handleNext = () => setViewingDay(prev => prev >= 6 ? 0 : prev + 1);
  const handlePrev = () => setViewingDay(prev => prev <= 0 ? 6 : prev - 1);

  const title = viewingDay === today ? "Today's Timetable" : dayNames[viewingDay];

  return (
    <main>
      <div className="timetable active" style={{ position: 'relative', height: 'auto', marginTop: '2rem' }}>
        <div>
          <span id="prev" onClick={handlePrev}>&lt;</span>
          <h2>{title}</h2>
          <span id="next" onClick={handleNext}>&gt;</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>phòng</th>
              <th>Môn học</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {timetableData[viewingDay]?.map((entry, index) => (
              <tr key={index}>
                <td>{entry.time}</td>
                <td>{entry.roomNumber}</td>
                <td>{entry.subject}</td>
                <td>{entry.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}