'use client';

import React, { useState, useEffect } from 'react';
import { timetableData } from '../constants';

// ─── Kiểu dữ liệu ────────────────────────────────────────────
interface CustomEvent {
  id: string;
  date: string;       // YYYY-MM-DD
  title: string;
  type: 'study' | 'group' | 'other';
  time: string;       // HH:MM
}

type EventType = CustomEvent['type'];

// ─── Hằng số ─────────────────────────────────────────────────
const DAY_NAMES_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const DAY_NAMES_FULL  = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const MONTH_NAMES     = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                         'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];

const EVENT_TYPE_LABEL: Record<EventType, string> = {
  study: 'Ôn thi',
  group: 'Họp nhóm',
  other: 'Khác',
};

const EVENT_TYPE_COLOR: Record<EventType, string> = {
  study: 'var(--color-warning)',
  group: 'var(--color-success)',
  other: 'var(--color-info)',
};

// Màu môn học trong timetable
const SUBJECT_COLORS: Record<string, string> = {
  DBMS130: 'var(--color-primary)',
  MTH166:  'var(--color-danger)',
  NS200:   'var(--color-success)',
  CS849:   'var(--color-warning)',
  CS200:   '#7d5fff',
  MEC103:  '#18dcff',
};

// ─── Helpers ─────────────────────────────────────────────────
const generateId = () => `evt_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;

const toDateStr = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay(); // 0=CN

// ─── Component chính ─────────────────────────────────────────
export default function TimetablePage() {
  const today = new Date();

  const [currentYear,  setCurrentYear]  = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Modal thêm sự kiện
  const [showModal, setShowModal] = useState(false);
  const [newTitle,  setNewTitle]  = useState('');
  const [newType,   setNewType]   = useState<EventType>('study');
  const [newTime,   setNewTime]   = useState('08:00');

  // Custom events từ localStorage
  const [customEvents, setCustomEvents] = useState<CustomEvent[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const s = localStorage.getItem('ums_timetable_events');
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  });

  // Lưu localStorage khi events thay đổi
  useEffect(() => {
    localStorage.setItem('ums_timetable_events', JSON.stringify(customEvents));
  }, [customEvents]);

  // ── Điều hướng tháng ──────────────────────────────────────
  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  // ── Lấy lịch học cố định cho 1 ngày (theo dayOfWeek) ─────
  const getScheduleForDate = (dateStr: string) => {
    const dow = new Date(dateStr).getDay();
    return timetableData[dow] || [];
  };

  // ── Lấy custom events cho 1 ngày ─────────────────────────
  const getCustomEventsForDate = (dateStr: string) =>
    customEvents.filter(e => e.date === dateStr);

  // ── Thêm custom event ─────────────────────────────────────
  const handleAddEvent = () => {
    if (!newTitle.trim() || !selectedDate) return;
    const ev: CustomEvent = {
      id: generateId(),
      date: selectedDate,
      title: newTitle.trim(),
      type: newType,
      time: newTime,
    };
    setCustomEvents(prev => [...prev, ev]);
    setNewTitle(''); setNewType('study'); setNewTime('08:00');
    setShowModal(false);
  };

  // ── Xóa custom event ──────────────────────────────────────
  const handleDeleteEvent = (id: string) => {
    setCustomEvents(prev => prev.filter(e => e.id !== id));
  };

  // ── Build lưới calendar ───────────────────────────────────
  const daysInMonth   = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = getFirstDayOfMonth(currentYear, currentMonth);
  // Ô trống trước ngày 1
  const blanks = Array(firstDayOfWeek).fill(null);
  const days   = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  // Ngày đang chọn để hiển thị detail
  const selectedSchedule    = selectedDate ? getScheduleForDate(selectedDate) : [];
  const selectedCustomEvents = selectedDate ? getCustomEventsForDate(selectedDate) : [];
  const selectedDow          = selectedDate ? new Date(selectedDate).getDay() : -1;

  return (
    <>
      <main style={{ marginTop: '1.4rem' }}>
        <h1>Time Table</h1>
        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
          Lịch học theo tháng — click vào ngày để xem chi tiết hoặc thêm sự kiện
        </p>

        {/* ── Calendar card ──────────────────────────────── */}
        <div style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--card-border-radius)',
          padding: 'var(--card-padding)',
          boxShadow: 'var(--box-shadow)',
          marginBottom: '1.5rem',
        }}>
          {/* Header: điều hướng tháng */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <button onClick={prevMonth} style={navBtnStyle}>
              <span className="material-icons-sharp">chevron_left</span>
            </button>
            <h2 style={{ margin: 0 }}>
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h2>
            <button onClick={nextMonth} style={navBtnStyle}>
              <span className="material-icons-sharp">chevron_right</span>
            </button>
          </div>

          {/* Tên các ngày trong tuần */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
            {DAY_NAMES_SHORT.map(d => (
              <div key={d} style={{ textAlign: 'center', padding: '0.4rem 0', fontWeight: 600, fontSize: '0.8rem', color: 'var(--color-info)' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Lưới ngày */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {/* Ô trống */}
            {blanks.map((_, i) => <div key={`b${i}`} />)}

            {/* Các ngày */}
            {days.map(day => {
              const dateStr  = toDateStr(currentYear, currentMonth, day);
              const dow      = new Date(dateStr).getDay();
              const hasClass = dow !== 0 && (timetableData[dow]?.length > 0);
              const hasCustom = customEvents.some(e => e.date === dateStr);
              const isToday   = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              const isSunday  = dow === 0;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  style={{
                    minHeight: '52px',
                    padding: '0.3rem',
                    borderRadius: 'var(--border-radius-1)',
                    cursor: 'pointer',
                    border: isSelected ? '2px solid var(--color-primary)' : '2px solid transparent',
                    background: isToday ? 'var(--color-primary)' : isSelected ? 'var(--color-light)' : 'transparent',
                    transition: 'all 200ms ease',
                    position: 'relative',
                  }}
                  onMouseEnter={e => { if (!isSelected && !isToday) (e.currentTarget as HTMLElement).style.background = 'var(--color-light)'; }}
                  onMouseLeave={e => { if (!isSelected && !isToday) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  {/* Số ngày */}
                  <div style={{
                    fontWeight: isToday ? 700 : 400,
                    color: isToday ? '#fff' : isSunday ? 'var(--color-danger)' : 'var(--color-dark)',
                    fontSize: '0.85rem',
                    textAlign: 'center',
                    marginBottom: '2px',
                  }}>
                    {day}
                  </div>

                  {/* Dot: có lịch học */}
                  {hasClass && !isSunday && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', flexWrap: 'wrap' }}>
                      {(timetableData[dow] || []).slice(0, 3).map((entry, i) => (
                        <div key={i} style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          background: SUBJECT_COLORS[entry.subject] || 'var(--color-primary)',
                        }} />
                      ))}
                    </div>
                  )}

                  {/* Dot: custom event */}
                  {hasCustom && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-warning)' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Chú thích màu */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-light)' }}>
            {Object.entries(SUBJECT_COLORS).map(([sub, color]) => (
              <div key={sub} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                <small className="text-muted">{sub}</small>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-warning)' }} />
              <small className="text-muted">Sự kiện tùy chỉnh</small>
            </div>
          </div>
        </div>

        {/* ── Chi tiết ngày được chọn ─────────────────────── */}
        {selectedDate && (
          <div style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--card-border-radius)',
            padding: 'var(--card-padding)',
            boxShadow: 'var(--box-shadow)',
          }}>
            {/* Tiêu đề + nút thêm */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <h2 style={{ margin: 0 }}>{DAY_NAMES_FULL[selectedDow]}</h2>
                <small className="text-muted">
                  {selectedDate.split('-').reverse().join('/')}
                </small>
              </div>
              <button
                onClick={() => setShowModal(true)}
                style={btnPrimaryStyle}
              >
                <span className="material-icons-sharp" style={{ fontSize: '1rem' }}>add</span>
                Thêm sự kiện
              </button>
            </div>

            {/* Lịch học cố định */}
            {selectedDow !== 0 && selectedSchedule.length > 0 && (
              <div style={{ marginBottom: '1.2rem' }}>
                <h3 style={{ marginBottom: '0.8rem', color: 'var(--color-info)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Lịch học
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedSchedule.map((entry, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '0.7rem 1rem',
                      borderRadius: 'var(--border-radius-1)',
                      background: 'var(--color-light)',
                      borderLeft: `4px solid ${SUBJECT_COLORS[entry.subject] || 'var(--color-primary)'}`,
                    }}>
                      <span className="material-icons-sharp" style={{ fontSize: '1rem', color: 'var(--color-info)' }}>schedule</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-dark)' }}>{entry.subject}</p>
                        <small className="text-muted">{entry.time} · Phòng {entry.roomNumber} · {entry.type}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedDow === 0 && (
              <p className="text-muted" style={{ marginBottom: '1rem' }}>Chủ Nhật — không có lịch học.</p>
            )}

            {/* Custom events */}
            {selectedCustomEvents.length > 0 && (
              <div>
                <h3 style={{ marginBottom: '0.8rem', color: 'var(--color-info)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Sự kiện của bạn
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedCustomEvents.map(ev => (
                    <div key={ev.id} style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '0.7rem 1rem',
                      borderRadius: 'var(--border-radius-1)',
                      background: 'var(--color-light)',
                      borderLeft: `4px solid ${EVENT_TYPE_COLOR[ev.type]}`,
                    }}>
                      <span className="material-icons-sharp" style={{ fontSize: '1rem', color: EVENT_TYPE_COLOR[ev.type] }}>event_note</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-dark)' }}>{ev.title}</p>
                        <small className="text-muted">{ev.time} · {EVENT_TYPE_LABEL[ev.type]}</small>
                      </div>
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-info)', display: 'flex', padding: '0.2rem', borderRadius: '50%', transition: 'color 200ms' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-danger)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-info)')}
                      >
                        <span className="material-icons-sharp" style={{ fontSize: '1.1rem' }}>delete_outline</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trạng thái rỗng */}
            {selectedSchedule.length === 0 && selectedCustomEvents.length === 0 && (
              <p className="text-muted">Không có lịch học hay sự kiện nào. Bấm &quot;Thêm sự kiện&quot; để ghi chú.</p>
            )}
          </div>
        )}
      </main>

      {/* ── Cột phải: tuần này ──────────────────────────────── */}
      <div className="right">
        <div className="announcements">
          <h2>Tuần này</h2>
          <div className="updates">
            {Array.from({ length: 7 }, (_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - d.getDay() + i);
              const dateStr = toDateStr(d.getFullYear(), d.getMonth(), d.getDate());
              const dow = d.getDay();
              const entries = timetableData[dow] || [];
              const customs = customEvents.filter(e => e.date === dateStr);
              if (entries.length === 0 && customs.length === 0) return null;
              return (
                <div key={i} className="message" style={{ cursor: 'pointer' }} onClick={() => setSelectedDate(dateStr)}>
                  <p><b>{DAY_NAMES_FULL[dow]}</b></p>
                  {entries.map((e, j) => (
                    <small key={j} style={{ display: 'block', color: SUBJECT_COLORS[e.subject] || 'var(--color-primary)' }}>
                      ● {e.subject} {e.time}
                    </small>
                  ))}
                  {customs.map(c => (
                    <small key={c.id} style={{ display: 'block', color: EVENT_TYPE_COLOR[c.type] }}>
                      ● {c.title} {c.time}
                    </small>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Modal thêm sự kiện ──────────────────────────────── */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 3000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--border-radius-2)',
            padding: '2rem',
            width: '90%', maxWidth: '400px',
            boxShadow: '0 2rem 4rem rgba(0,0,0,0.2)',
          }}>
            <h2 style={{ marginBottom: '1.2rem' }}>Thêm sự kiện</h2>
            <small className="text-muted" style={{ display: 'block', marginBottom: '1rem' }}>
              Ngày: {selectedDate?.split('-').reverse().join('/')}
            </small>

            <div style={{ marginBottom: '1rem' }}>
              <p className="text-muted" style={{ marginBottom: '0.3rem', lineHeight: 1.5 }}>
                Tên sự kiện <span style={{ color: 'var(--color-danger)' }}>*</span>
              </p>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddEvent()}
                placeholder="VD: Ôn thi DBMS130..."
                style={inputStyle}
                autoFocus
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
              <div>
                <p className="text-muted" style={{ marginBottom: '0.3rem', lineHeight: 1.5 }}>Loại</p>
                <select value={newType} onChange={e => setNewType(e.target.value as EventType)} style={inputStyle}>
                  <option value="study">📖 Ôn thi</option>
                  <option value="group">👥 Họp nhóm</option>
                  <option value="other">📌 Khác</option>
                </select>
              </div>
              <div>
                <p className="text-muted" style={{ marginBottom: '0.3rem', lineHeight: 1.5 }}>Thời gian</p>
                <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button onClick={handleAddEvent} style={btnPrimaryStyle}>
                <span className="material-icons-sharp" style={{ fontSize: '1rem' }}>check</span>
                Lưu
              </button>
              <button onClick={() => setShowModal(false)} style={btnSecondaryStyle}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Shared styles ───────────────────────────────────────────
const navBtnStyle: React.CSSProperties = {
  background: 'var(--color-light)',
  border: 'none',
  borderRadius: 'var(--border-radius-1)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  padding: '0.4rem',
  color: 'var(--color-dark)',
  transition: 'background 200ms ease',
};

const btnPrimaryStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
  padding: '0.5rem 1.2rem',
  background: 'var(--color-primary)', color: '#fff',
  border: 'none', borderRadius: 'var(--border-radius-1)',
  cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem',
  transition: 'opacity 200ms ease',
};

const btnSecondaryStyle: React.CSSProperties = {
  ...btnPrimaryStyle,
  background: 'var(--color-light)',
  color: 'var(--color-dark)',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.5rem 0.8rem',
  border: '1px solid var(--color-light)',
  borderRadius: 'var(--border-radius-1)',
  background: 'transparent', color: 'var(--color-dark)',
  fontFamily: 'inherit', fontSize: '0.88rem', outline: 'none',
};