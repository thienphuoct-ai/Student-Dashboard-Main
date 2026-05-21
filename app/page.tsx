'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { timetableData, dayNames } from './constants';

export default function Home() {
  // State quản lý ngày đang hiển thị (mặc định là ngày hiện tại)
  const [viewingDay, setViewingDay] = useState(new Date().getDay());
  // State quản lý việc đóng/mở bảng timetable
  const [isTimetableActive, setIsTimetableActive] = useState(false);

  // Hàm bật/tắt bảng timetable
  const timeTableAll = () => {
    setViewingDay(new Date().getDay()); // Reset về ngày hiện tại khi mở
    setIsTimetableActive(!isTimetableActive);
  };

  // Chuyển sang ngày tiếp theo
  const handleNextDay = () => {
    setViewingDay((prev) => (prev <= 5 ? prev + 1 : 0));
  };

  // Quay lại ngày trước đó
  const handlePrevDay = () => {
    setViewingDay((prev) => (prev >= 1 ? prev - 1 : 6));
  };
     // Thêm vào app/page.tsx
useEffect(() => {
  const handler = () => {
    setViewingDay(new Date().getDay());
    setIsTimetableActive(prev => !prev);
  };
  window.addEventListener('toggle-timetable', handler);
  return () => window.removeEventListener('toggle-timetable', handler);
}, []);

  return (
    <>
        <main style={{ marginTop: '1.4rem' }}>
          <h1>Điểm danh</h1>
          <div className="subjects">
            <div className="eg">
              <span className="material-icons-sharp">architecture</span>
              <h3>Engineering Graphics</h3>
              <h2>12/14</h2>
              <div className="progress">
                <svg><circle cx="38" cy="38" r="36"></circle></svg>
                <div className="number"><p>86%</p></div>
              </div>
              <small className="text-muted">24 giờ trước</small>
            </div>
            <div className="mth">
              <span className="material-icons-sharp">functions</span>
              <h3>Mathematical Engineering</h3>
              <h2>27/29</h2>
              <div className="progress">
                <svg><circle cx="38" cy="38" r="36"></circle></svg>
                <div className="number"><p>93%</p></div>
              </div>
              <small className="text-muted">24 giờ trước</small>
            </div>
            <div className="cs">
              <span className="material-icons-sharp">computer</span>
              <h3>Computer Architecture</h3>
              <h2>27/30</h2>
              <div className="progress">
                <svg><circle cx="38" cy="38" r="36"></circle></svg>
                <div className="number"><p>81%</p></div>
              </div>
              <small className="text-muted">24 giờ trước</small>
            </div>
            <div className="cg">
              <span className="material-icons-sharp">dns</span>
              <h3>Database Management</h3>
              <h2>24/25</h2>
              <div className="progress">
                <svg><circle cx="38" cy="38" r="36"></circle></svg>
                <div className="number"><p>96%</p></div>
              </div>
              <small className="text-muted">24 giờ trước</small>
            </div>
            <div className="net">
              <span className="material-icons-sharp">router</span>
              <h3>Network Security</h3>
              <h2>25/27</h2>
              <div className="progress">
                <svg><circle cx="38" cy="38" r="36"></circle></svg>
                <div className="number"><p>92%</p></div>
              </div>
              <small className="text-muted">24 giờ trước</small>
            </div>
          </div>

          <div className={`timetable ${isTimetableActive ? 'active' : ''}`} id="timetable">
            <div>
              <span id="prev" onClick={handlePrevDay}>&lt;</span>
              <h2>{viewingDay === new Date().getDay() ? "Lịch học " : dayNames[viewingDay]}</h2>
              <span id="next" onClick={handleNextDay}>&gt;</span>
            </div>
            <span className="Đóng" onClick={timeTableAll}>X</span>
            <table>
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Phòng</th>
                  <th>Môn học</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {timetableData[viewingDay]?.map((sub, index) => (
                  <tr key={index}>
                    <td>{sub.time}</td>
                    <td>{sub.roomNumber}</td>
                    <td>{sub.subject}</td>
                    <td>{sub.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
        <div className="right">
          <div className="announcements">
            <h2>Thông báo</h2>
            <div className="updates">
              <div className="message">
                <p> <b>Học vụ</b> Thực tập đào tạo hè với các Dự án Thực tế.</p>
                <small className="text-muted">2 phút trước</small>
              </div>
              <div className="message">
                <p> <b>Ngoại khóa</b> Cơ hội thực tập toàn cầu từ Tổ chức Sinh viên.</p>
                <small className="text-muted">10 phút trước</small>
              </div>
              <div className="message">
                <p> <b>Thi cử</b> Hướng dẫn làm bài Thi Giữa kỳ.</p>
                <small className="text-muted">Hôm qua</small>
              </div>
            </div>
          </div>

          <div className="leaves">
            <h2>Giáo viên nghỉ</h2>
            <div className="teacher">
              <div className="profile-photo"><Image src="/images/profile-2.jpeg" alt="The Professor" width={40} height={40} /></div>
              <div className="info">
                <h3>Giáo sư</h3>
                <small className="text-muted">Nghỉ cả ngày</small>
              </div>
            </div>
            <div className="teacher">
              <div className="profile-photo"><Image src="/images/profile-3.jpg" alt="Lisa Manobal" width={40} height={40} /></div>
              <div className="info">
                <h3>Lisa Manobal</h3>
                <small className="text-muted">Nửa ngày</small>
              </div>
            </div>
            <div className="teacher">
              <div className="profile-photo"><Image src="/images/profile-4.jpg" alt="Himanshu Jindal" width={40} height={40} /></div>
              <div className="info">
                <h3>Himanshu Jindal</h3>
                <small className="text-muted">Nghỉ cả ngày</small>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
