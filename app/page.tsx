'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { timetableData, dayNames } from './constants';
const basePath = process.env.NODE_ENV === 'production'
  ? '/Student-Dashboard-Main'
  : '';

export default function Home() {
  const [viewingDay, setViewingDay] = useState(new Date().getDay());
  const [isTimetableActive, setIsTimetableActive] = useState(false);

  const timeTableAll = () => {
    setViewingDay(new Date().getDay());
    setIsTimetableActive(!isTimetableActive);
  };

  const handleNextDay = () => {
    setViewingDay((prev) => (prev <= 5 ? prev + 1 : 0));
  };

  const handlePrevDay = () => {
    setViewingDay((prev) => (prev >= 1 ? prev - 1 : 6));
  };

  useEffect(() => {
    const handler = () => {
      setViewingDay(new Date().getDay());
      setIsTimetableActive((prev) => !prev);
    };
    window.addEventListener('toggle-timetable', handler);
    return () => window.removeEventListener('toggle-timetable', handler);
  }, []);

  return (
    <>
      {/* ── CỘT GIỮA: Nội dung chính ── */}
      <main style={{ marginTop: '1.4rem' }}>
        <h1>Điểm danh</h1>

        {/* Các thẻ thống kê điểm danh */}
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

        {/* Bảng thời khóa biểu — toggle khi bấm nút expand */}
        <div className={`timetable ${isTimetableActive ? 'active' : ''}`} id="timetable">
          <div>
            <span id="prev" onClick={handlePrevDay}>&lt;</span>
            <h2>
              {viewingDay === new Date().getDay()
                ? "Today's Timetable"
                : dayNames[viewingDay]}
            </h2>
            <span id="next" onClick={handleNextDay}>&gt;</span>
          </div>

          {/* Nút đóng — chỉ hiện khi bảng đang ở chế độ fullscreen */}
          <span className="closeBtn" onClick={timeTableAll}>X</span>

          <table>
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>phòng học</th>
                <th>Mã môn học</th>
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

      {/* ── CỘT PHẢI: Thông báo + Giáo viên nghỉ ── */}
      <div className="right">
        {/* Thông báo */}
        <div className="announcements">
          <h2>Thông báo</h2>
          <div className="updates">
            <div className="message">
              <p>
                <b>Học vụ</b>Đăng ký chương trình Thực tập hè 2026 - Dự án thực chiến với doanh nghiệp.
              </p>
              <small className="text-muted">2 phút trước</small>
            </div>
            <div className="message">
              <p>
                <b>Kiến tập</b> Tham quan công ty FPT Software vào ngày 22/5/2026.
              </p>
              <small className="text-muted">10 phút trước</small>
            </div>
            <div className="message">
              <p>
                <b>Ôn tập</b> Luyện tập các bài đã học.
              </p>
              <small className="text-muted">Hôm qua</small>
            </div>
          </div>
        </div>

        {/* Giáo viên nghỉ */}
        <div className="leaves">
          <h2>Giáo viên nghỉ</h2>

          <div className="teacher">
            <div className="profile-photo">
              <Image
                src={`${basePath}/images/profile-2.png`}
                alt="Nguyễn Vũ Phúc"
                width={40}
                height={40}
              />
            </div>
            <div className="info">
              <h3>Nguyễn Vũ Phúc</h3>
              <small className="text-muted">Nghỉ cả ngày</small>
            </div>
          </div>

          <div className="teacher">
            <div className="profile-photo">
              <Image
                src={`${basePath}/images/profile-3.png`}
                alt="Duy Quang"
                width={40}
                height={40}
              />
            </div>
            <div className="info">
              <h3>Duy Quang</h3>
              <small className="text-muted">Nghỉ nửa ngày</small>
            </div>
          </div>

          <div className="teacher">
            <div className="profile-photo">
              <Image
                src={`${basePath}/images/profile-4.jpg`}
                alt="Nguyễn Minh Phúc"
                width={40}
                height={40}
              />
            </div>
            <div className="info">
              <h3>Nguyễn Minh Phúc</h3>
              <small className="text-muted">Nghỉ cả ngày</small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}