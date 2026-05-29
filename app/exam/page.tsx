'use client';

import React, { useState, useEffect } from 'react';

// ─── Kiểu dữ liệu ────────────────────────────────────────────
interface ExamEntry {
  id: string;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:MM
  subject: string;
  room: string;
  reminded: boolean;  // đã bật nhắc nhở chưa
}

// ─── Dữ liệu thi cố định (chuyển từ dạng cũ sang mới) ────────
const DEFAULT_EXAMS: ExamEntry[] = [
  { id: 'e1', date: '2026-06-13', time: '09:00', subject: 'CS200',   room: '38-718', reminded: false },
  { id: 'e2', date: '2026-06-16', time: '09:00', subject: 'DBMS130', room: '38-718', reminded: false },
  { id: 'e3', date: '2026-06-18', time: '09:00', subject: 'MTH166',  room: '38-718', reminded: false },
  { id: 'e4', date: '2026-06-20', time: '09:00', subject: 'NS200',   room: '38-718', reminded: false },
  { id: 'e5', date: '2026-06-23', time: '09:00', subject: 'CS849',   room: '38-718', reminded: false },
];

// Màu môn học
const SUBJECT_COLORS: Record<string, string> = {
  CS200:   '#7d5fff',
  DBMS130: 'var(--color-primary)',
  MTH166:  'var(--color-danger)',
  NS200:   'var(--color-success)',
  CS849:   'var(--color-warning)',
};

// ─── Helpers ─────────────────────────────────────────────────
const formatDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
};

const getDaysLeft = (dateStr: string, timeStr: string): number => {
  const now  = new Date();
  const exam = new Date(`${dateStr}T${timeStr}:00`);
  return Math.ceil((exam.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

// Format đếm ngược chi tiết hơn
const getCountdown = (dateStr: string, timeStr: string): string => {
  const now  = new Date();
  const exam = new Date(`${dateStr}T${timeStr}:00`);
  const diff = exam.getTime() - now.getTime();

  if (diff <= 0) return 'Đã qua';

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days} ngày ${hours} giờ`;
  if (hours > 0) return `${hours} giờ ${minutes} phút`;
  return `${minutes} phút`;
};

// ─── Component chính ─────────────────────────────────────────
export default function ExamPage() {
  // Load exams từ localStorage, fallback về DEFAULT_EXAMS
  const [exams, setExams] = useState<ExamEntry[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_EXAMS;
    try {
      const s = localStorage.getItem('ums_exams');
      return s ? JSON.parse(s) : DEFAULT_EXAMS;
    } catch { return DEFAULT_EXAMS; }
  });

  // Tick mỗi phút để cập nhật đếm ngược
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  // Lưu localStorage
  useEffect(() => {
    localStorage.setItem('ums_exams', JSON.stringify(exams));
  }, [exams]);

  // ── Toggle nhắc nhở ───────────────────────────────────────
  const toggleReminder = (id: string) => {
    setExams(prev =>
      prev.map(e =>
        e.id === id ? { ...e, reminded: !e.reminded } : e
      )
    );
  };

  // ── Phân loại exams ───────────────────────────────────────
  const upcoming = exams.filter(e => getDaysLeft(e.date, e.time) > 0)
                        .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
  const passed   = exams.filter(e => getDaysLeft(e.date, e.time) <= 0);

  // Kỳ thi gần nhất
  const nearest  = upcoming[0] || null;
  const nearestDays = nearest ? getDaysLeft(nearest.date, nearest.time) : null;

  return (
    <>
      <main style={{ marginTop: '1.4rem' }}>
        <h1>Examination</h1>
        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
          Lịch thi và đếm ngược thời gian
        </p>

        {/* ── Banner kỳ thi gần nhất ────────────────────── */}
        {nearest && (
          <div style={{
            background: nearestDays !== null && nearestDays <= 3
              ? 'linear-gradient(135deg, #ff7782, #ff4757)'
              : 'linear-gradient(135deg, var(--color-primary), #a29bfe)',
            borderRadius: 'var(--card-border-radius)',
            padding: '1.8rem 2rem',
            marginBottom: '1.5rem',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <small style={{ opacity: 0.85, fontWeight: 500 }}>
                {nearestDays !== null && nearestDays <= 3 ? '⚠️ Sắp thi!' : '📅 Kỳ thi tiếp theo'}
              </small>
              <h2 style={{ margin: '0.3rem 0', color: '#fff' }}>{nearest.subject}</h2>
              <p style={{ margin: 0, opacity: 0.9, color: '#fff' }}>
                {formatDate(nearest.date)} · {nearest.time} · Phòng {nearest.room}
              </p>
            </div>
            {/* Đồng hồ đếm ngược lớn */}
            <div style={{ textAlign: 'right' }}>
              <small style={{ opacity: 0.85 }}>Còn lại</small>
              <h1 style={{ margin: 0, color: '#fff', fontSize: '2rem' }}>
                {getCountdown(nearest.date, nearest.time)}
              </h1>
            </div>
          </div>
        )}

        {/* ── Thống kê nhanh ────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>
          <StatBox icon="event_note"   color="var(--color-primary)" label="Tổng kỳ thi"   value={exams.length} />
          <StatBox icon="pending"      color="var(--color-warning)" label="Sắp thi"        value={upcoming.length} />
          <StatBox icon="notifications_active" color="var(--color-success)" label="Đã nhắc nhở" value={exams.filter(e => e.reminded).length} />
        </div>

        {/* ── Bảng kỳ thi sắp tới ───────────────────────── */}
        <div style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--card-border-radius)',
          padding: 'var(--card-padding)',
          boxShadow: 'var(--box-shadow)',
          marginBottom: '1.5rem',
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Lịch thi</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Ngày', 'Giờ', 'Môn học', 'Phòng', 'Đếm ngược', 'Nhắc nhở'].map(h => (
                  <th key={h} style={{ padding: '0.8rem 1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-info)', fontWeight: 600, borderBottom: '1px solid var(--color-light)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {upcoming.map(exam => {
                const days = getDaysLeft(exam.date, exam.time);
                const isUrgent = days <= 3;
                const isVeryUrgent = days <= 1;

                return (
                  <tr key={exam.id} style={{ transition: 'background 200ms' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-light)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Ngày */}
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: SUBJECT_COLORS[exam.subject] || 'var(--color-primary)', flexShrink: 0 }} />
                        {formatDate(exam.date)}
                      </div>
                    </td>

                    {/* Giờ */}
                    <td style={tdStyle}>{exam.time}</td>

                    {/* Môn học */}
                    <td style={{ ...tdStyle, fontWeight: 600, color: SUBJECT_COLORS[exam.subject] || 'var(--color-dark)' }}>
                      {exam.subject}
                    </td>

                    {/* Phòng */}
                    <td style={tdStyle}>{exam.room}</td>

                    {/* Đếm ngược */}
                    <td style={{ ...tdStyle, fontWeight: isUrgent ? 700 : 400 }}>
                      <span style={{
                        padding: '0.2rem 0.7rem',
                        borderRadius: '999px',
                        background: isVeryUrgent ? '#ff778222' : isUrgent ? '#ffbb5522' : 'var(--color-light)',
                        color: isVeryUrgent ? 'var(--color-danger)' : isUrgent ? 'var(--color-warning)' : 'var(--color-dark-varient)',
                        fontSize: '0.82rem',
                        whiteSpace: 'nowrap',
                      }}>
                        {isVeryUrgent && '🔴 '}{isUrgent && !isVeryUrgent && '🟡 '}
                        {getCountdown(exam.date, exam.time)}
                      </span>
                    </td>

                    {/* Nút nhắc nhở */}
                    <td style={{ ...tdStyle }}>
                      <button
                        onClick={() => toggleReminder(exam.id)}
                        title={exam.reminded ? 'Tắt nhắc nhở' : 'Bật nhắc nhở'}
                        style={{
                          background: exam.reminded ? 'var(--color-primary)' : 'var(--color-light)',
                          border: 'none',
                          borderRadius: 'var(--border-radius-1)',
                          padding: '0.3rem 0.8rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          color: exam.reminded ? '#fff' : 'var(--color-info)',
                          fontSize: '0.82rem',
                          fontFamily: 'inherit',
                          transition: 'all 200ms ease',
                        }}
                      >
                        <span className="material-icons-sharp" style={{ fontSize: '0.95rem' }}>
                          {exam.reminded ? 'notifications_active' : 'notifications_none'}
                        </span>
                        {exam.reminded ? 'Đã nhắc' : 'Nhắc nhở'}
                      </button>
                    </td>
                  </tr>
                );
              })}

              {upcoming.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-info)' }}>
                    Không còn kỳ thi nào sắp tới
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Kỳ thi đã qua ─────────────────────────────── */}
        {passed.length > 0 && (
          <div style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--card-border-radius)',
            padding: 'var(--card-padding)',
            boxShadow: 'var(--box-shadow)',
            opacity: 0.7,
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--color-info)' }}>Đã thi</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Ngày', 'Giờ', 'Môn học', 'Phòng'].map(h => (
                    <th key={h} style={{ padding: '0.6rem 1rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--color-info)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {passed.map(exam => (
                  <tr key={exam.id}>
                    <td style={{ ...tdStyle, textDecoration: 'line-through' }}>{formatDate(exam.date)}</td>
                    <td style={{ ...tdStyle, textDecoration: 'line-through' }}>{exam.time}</td>
                    <td style={{ ...tdStyle, textDecoration: 'line-through' }}>{exam.subject}</td>
                    <td style={{ ...tdStyle, textDecoration: 'line-through' }}>{exam.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ── Cột phải: Timeline đếm ngược ───────────────────── */}
      <div className="right">
        <div className="announcements">
          <h2>Đếm ngược</h2>
          <div className="updates">
            {upcoming.slice(0, 5).map(exam => {
              const days = getDaysLeft(exam.date, exam.time);
              return (
                <div key={exam.id} className="message">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0 }}>
                      <b style={{ color: SUBJECT_COLORS[exam.subject] || 'var(--color-primary)' }}>
                        {exam.subject}
                      </b>
                    </p>
                    {/* Badge nhắc nhở */}
                    {exam.reminded && (
                      <span className="material-icons-sharp" style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                        notifications_active
                      </span>
                    )}
                  </div>
                  <small className="text-muted">{formatDate(exam.date)} · {exam.time}</small>
                  <br />
                  <small style={{
                    fontWeight: 700,
                    color: days <= 1 ? 'var(--color-danger)' : days <= 3 ? 'var(--color-warning)' : 'var(--color-success)',
                  }}>
                    ⏱ Còn {getCountdown(exam.date, exam.time)}
                  </small>
                </div>
              );
            })}
            {upcoming.length === 0 && (
              <p className="text-muted" style={{ padding: '0.5rem 0' }}>Không còn kỳ thi nào</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Sub-component ────────────────────────────────────────────
function StatBox({ icon, color, label, value }: {
  icon: string; color: string; label: string; value: number;
}) {
  return (
    <div style={{
      background: 'var(--color-white)', padding: '1.2rem 1.5rem',
      borderRadius: 'var(--border-radius-2)', boxShadow: 'var(--box-shadow)',
      display: 'flex', alignItems: 'center', gap: '1rem',
    }}>
      <span className="material-icons-sharp" style={{ color, fontSize: '1.8rem' }}>{icon}</span>
      <div>
        <h2 style={{ margin: 0 }}>{value}</h2>
        <small className="text-muted">{label}</small>
      </div>
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────
const tdStyle: React.CSSProperties = {
  padding: '0.9rem 1rem',
  textAlign: 'center',
  borderBottom: '1px solid var(--color-light)',
  fontSize: '0.88rem',
  color: 'var(--color-dark-varient)',
};