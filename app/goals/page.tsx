'use client';

import React, { useState, useEffect } from 'react';

// ─── Kiểu dữ liệu ────────────────────────────────────────────
type GoalStatus = 'in_progress' | 'completed' | 'overdue';

interface Goal {
  id: string;
  title: string;
  subject: string;
  deadline: string;   // ISO date string (YYYY-MM-DD)
  progress: number;   // 0 - 100
  status: GoalStatus;
  createdAt: string;
}

// ─── Hằng số ─────────────────────────────────────────────────
const SUBJECTS = [
  'Engineering Graphics',
  'Mathematical Engineering',
  'Computer Architecture',
  'Database Management',
  'Network Security',
  'Khác',
];

const STATUS_LABEL: Record<GoalStatus, string> = {
  in_progress: 'Đang thực hiện',
  completed:   'Hoàn thành',
  overdue:     'Quá hạn',
};

const STATUS_COLOR: Record<GoalStatus, string> = {
  in_progress: 'var(--color-primary)',
  completed:   'var(--color-success)',
  overdue:     'var(--color-danger)',
};

const STATUS_ICON: Record<GoalStatus, string> = {
  in_progress: 'pending',
  completed:   'check_circle',
  overdue:     'cancel',
};

// ─── Helpers ─────────────────────────────────────────────────
const generateId = () =>
  `goal_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

// Tính trạng thái dựa trên deadline và progress
const computeStatus = (deadline: string, progress: number): GoalStatus => {
  if (progress >= 100) return 'completed';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dl = new Date(deadline);
  if (dl < today) return 'overdue';
  return 'in_progress';
};

// Format ngày từ YYYY-MM-DD sang DD/MM/YYYY
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
};

// Tính số ngày còn lại đến deadline
const daysLeft = (deadline: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dl = new Date(deadline);
  return Math.ceil((dl.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

// Ngày hôm nay dạng YYYY-MM-DD (dùng cho min của input date)
const todayStr = () => new Date().toISOString().split('T')[0];

// ─── Component chính ─────────────────────────────────────────
export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('ums_goals');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | GoalStatus>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle]       = useState('');
  const [subject, setSubject]   = useState(SUBJECTS[0]);
  const [deadline, setDeadline] = useState('');
  const [progress, setProgress] = useState(0);

  // ── Lưu vào localStorage mỗi khi goals thay đổi ─────────────
  useEffect(() => {
    localStorage.setItem('ums_goals', JSON.stringify(goals));
  }, [goals]);

  // ── Reset form ───────────────────────────────────────────────
  const resetForm = () => {
    setTitle('');
    setSubject(SUBJECTS[0]);
    setDeadline('');
    setProgress(0);
    setEditingId(null);
    setShowForm(false);
  };

  // ── Thêm hoặc cập nhật goal ──────────────────────────────────
  const handleSave = () => {
    if (!title.trim() || !deadline) return;

    const status = computeStatus(deadline, progress);

    if (editingId) {
      // Cập nhật goal đang chỉnh sửa
      setGoals(prev =>
        prev.map(g =>
          g.id === editingId
            ? { ...g, title: title.trim(), subject, deadline, progress, status }
            : g
        )
      );
    } else {
      // Thêm goal mới
      const newGoal: Goal = {
        id: generateId(),
        title: title.trim(),
        subject,
        deadline,
        progress,
        status,
        createdAt: new Date().toISOString(),
      };
      setGoals(prev => [newGoal, ...prev]);
    }

    resetForm();
  };

  // ── Mở form chỉnh sửa với dữ liệu hiện tại ──────────────────
  const handleEdit = (goal: Goal) => {
    setTitle(goal.title);
    setSubject(goal.subject);
    setDeadline(goal.deadline);
    setProgress(goal.progress);
    setEditingId(goal.id);
    setShowForm(true);
    // Cuộn lên đầu trang để thấy form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Cập nhật progress nhanh (slider trực tiếp trên card) ─────
  const handleProgressUpdate = (id: string, newProgress: number) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id !== id) return g;
        const status = computeStatus(g.deadline, newProgress);
        return { ...g, progress: newProgress, status };
      })
    );
  };

  // ── Xóa goal ─────────────────────────────────────────────────
  const handleDelete = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // ── Lọc goals theo tab ───────────────────────────────────────
  const filteredGoals = goals.filter(g =>
    filter === 'all' ? true : g.status === filter
  );

  // ── Thống kê ─────────────────────────────────────────────────
  const total       = goals.length;
  const completed   = goals.filter(g => g.status === 'completed').length;
  const inProgress  = goals.filter(g => g.status === 'in_progress').length;
  const overdue     = goals.filter(g => g.status === 'overdue').length;
  const avgProgress = total > 0
    ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / total)
    : 0;

  return (
    <>
      {/* ── CỘT GIỮA ──────────────────────────────────────────── */}
      <main style={{ marginTop: '1.4rem' }}>
        <h1>Goals</h1>
        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
          Đặt mục tiêu và theo dõi tiến độ học tập
        </p>

        {/* ── 4 ô thống kê ──────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          marginBottom: '1.8rem',
        }}>
          <StatBox icon="flag"          color="var(--color-primary)" label="Tổng mục tiêu"     value={total} />
          <StatBox icon="pending"       color="var(--color-warning)" label="Đang thực hiện"    value={inProgress} />
          <StatBox icon="check_circle"  color="var(--color-success)" label="Hoàn thành"        value={completed} />
          <StatBox icon="cancel"        color="var(--color-danger)"  label="Quá hạn"           value={overdue} />
        </div>

        {/* ── Progress tổng thể ─────────────────────────────── */}
        {total > 0 && (
          <div style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--border-radius-2)',
            padding: '1.2rem 1.5rem',
            marginBottom: '1.5rem',
            boxShadow: 'var(--box-shadow)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <small><b>Tiến độ trung bình</b></small>
              <small className="text-muted">{avgProgress}%</small>
            </div>
            <div style={{ height: '8px', background: 'var(--color-light)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${avgProgress}%`,
                background: 'var(--color-primary)',
                borderRadius: '4px',
                transition: 'width 500ms ease',
              }} />
            </div>
          </div>
        )}

        {/* ── Thanh công cụ ─────────────────────────────────── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          {/* Tabs filter */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {(['all', 'in_progress', 'completed', 'overdue'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: 'var(--border-radius-1)',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.85rem',
                  background: filter === f ? 'var(--color-primary)' : 'var(--color-light)',
                  color: filter === f ? '#fff' : 'var(--color-dark)',
                  transition: 'all 200ms ease',
                }}
              >
                {f === 'all' ? 'Tất cả' : STATUS_LABEL[f]}
              </button>
            ))}
          </div>

          {/* Nút thêm goal */}
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            style={btnPrimaryStyle}
          >
            <span className="material-icons-sharp" style={{ fontSize: '1rem' }}>add</span>
            Thêm mục tiêu
          </button>
        </div>

        {/* ── Form thêm / chỉnh sửa ─────────────────────────── */}
        {showForm && (
          <div style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--border-radius-2)',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: 'var(--box-shadow)',
            borderLeft: '4px solid var(--color-primary)',
          }}>
            <h3 style={{ marginBottom: '1rem' }}>
              {editingId ? 'Chỉnh sửa mục tiêu' : 'Mục tiêu mới'}
            </h3>

            {/* Tên mục tiêu */}
            <div style={{ marginBottom: '1rem' }}>
              <p className="text-muted" style={{ marginBottom: '0.3rem', lineHeight: 1.5 }}>
                Tên mục tiêu <span style={{ color: 'var(--color-danger)' }}>*</span>
              </p>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="VD: Đạt điểm A môn Database..."
                style={inputStyle}
              />
            </div>

            {/* Môn học + Deadline */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <p className="text-muted" style={{ marginBottom: '0.3rem', lineHeight: 1.5 }}>Môn học</p>
                <select value={subject} onChange={e => setSubject(e.target.value)} style={inputStyle}>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <p className="text-muted" style={{ marginBottom: '0.3rem', lineHeight: 1.5 }}>
                  Deadline <span style={{ color: 'var(--color-danger)' }}>*</span>
                </p>
                <input
                  type="date"
                  value={deadline}
                  min={todayStr()}
                  onChange={e => setDeadline(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Tiến độ hiện tại */}
            <div style={{ marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <p className="text-muted" style={{ lineHeight: 1.5 }}>Tiến độ hiện tại</p>
                <small style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{progress}%</small>
              </div>
              <input
                type="range"
                min={0} max={100} step={5}
                value={progress}
                onChange={e => setProgress(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
            </div>

            {/* Nút hành động */}
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button onClick={handleSave} style={btnPrimaryStyle}>
                <span className="material-icons-sharp" style={{ fontSize: '1rem' }}>check</span>
                {editingId ? 'Cập nhật' : 'Lưu'}
              </button>
              <button onClick={resetForm} style={btnSecondaryStyle}>Hủy</button>
            </div>
          </div>
        )}

        {/* ── Danh sách Goals ───────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredGoals.map(goal => {
            const days = daysLeft(goal.deadline);
            return (
              <div
                key={goal.id}
                style={{
                  background: 'var(--color-white)',
                  borderRadius: 'var(--border-radius-2)',
                  padding: '1.4rem',
                  boxShadow: 'var(--box-shadow)',
                  borderLeft: `4px solid ${STATUS_COLOR[goal.status]}`,
                  transition: 'box-shadow 300ms ease',
                }}
              >
                {/* Hàng 1: Tên + badge trạng thái + nút */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.6rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '0.95rem' }}>{goal.title}</h3>
                    <small className="text-muted">{goal.subject}</small>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                    {/* Badge trạng thái */}
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.2rem 0.7rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      background: `${STATUS_COLOR[goal.status]}22`,
                      color: STATUS_COLOR[goal.status],
                      fontWeight: 600,
                    }}>
                      <span className="material-icons-sharp" style={{ fontSize: '0.85rem' }}>
                        {STATUS_ICON[goal.status]}
                      </span>
                      {STATUS_LABEL[goal.status]}
                    </span>

                    {/* Nút sửa */}
                    <button onClick={() => handleEdit(goal)} style={iconBtnStyle}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-info)')}>
                      <span className="material-icons-sharp" style={{ fontSize: '1.1rem' }}>edit</span>
                    </button>

                    {/* Nút xóa */}
                    <button onClick={() => handleDelete(goal.id)} style={iconBtnStyle}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-danger)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-info)')}>
                      <span className="material-icons-sharp" style={{ fontSize: '1.1rem' }}>delete_outline</span>
                    </button>
                  </div>
                </div>

                {/* Hàng 2: Deadline + số ngày còn lại */}
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.8rem' }}>
                  <small className="text-muted">
                    <span className="material-icons-sharp" style={{ fontSize: '0.85rem', verticalAlign: 'middle' }}>event</span>
                    {' '}Deadline: {formatDate(goal.deadline)}
                  </small>
                  {goal.status !== 'completed' && (
                    <small style={{
                      color: days < 0 ? 'var(--color-danger)'
                           : days <= 3 ? 'var(--color-warning)'
                           : 'var(--color-info)',
                      fontWeight: days <= 3 ? 600 : 400,
                    }}>
                      {days < 0
                        ? `Quá hạn ${Math.abs(days)} ngày`
                        : days === 0
                        ? 'Hôm nay là deadline!'
                        : `Còn ${days} ngày`}
                    </small>
                  )}
                </div>

                {/* Hàng 3: Progress bar + slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <small className="text-muted">Tiến độ</small>
                    <small style={{ color: STATUS_COLOR[goal.status], fontWeight: 600 }}>
                      {goal.progress}%
                    </small>
                  </div>
                  {/* Progress bar hiển thị */}
                  <div style={{ height: '8px', background: 'var(--color-light)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.4rem' }}>
                    <div style={{
                      height: '100%',
                      width: `${goal.progress}%`,
                      background: STATUS_COLOR[goal.status],
                      borderRadius: '4px',
                      transition: 'width 400ms ease',
                    }} />
                  </div>
                  {/* Slider cập nhật nhanh */}
                  <input
                    type="range"
                    min={0} max={100} step={5}
                    value={goal.progress}
                    onChange={e => handleProgressUpdate(goal.id, Number(e.target.value))}
                    style={{ width: '100%', accentColor: STATUS_COLOR[goal.status], cursor: 'pointer' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Trạng thái rỗng ───────────────────────────────── */}
        {filteredGoals.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'var(--color-white)',
            borderRadius: 'var(--card-border-radius)',
            boxShadow: 'var(--box-shadow)',
          }}>
            <span className="material-icons-sharp" style={{ fontSize: '3rem', color: 'var(--color-info)' }}>
              flag
            </span>
            <h3 style={{ marginTop: '0.5rem' }}>Chưa có mục tiêu nào</h3>
            <p className="text-muted">Bấm &quot;Thêm mục tiêu&quot; để bắt đầu</p>
          </div>
        )}
      </main>

      {/* ── CỘT PHẢI ──────────────────────────────────────────── */}
      <div className="right">
        {/* Mục tiêu sắp đến hạn */}
        <div className="announcements">
          <h2>Sắp đến hạn</h2>
          <div className="updates">
            {goals
              .filter(g => g.status === 'in_progress')
              .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
              .slice(0, 4)
              .map(g => {
                const days = daysLeft(g.deadline);
                return (
                  <div key={g.id} className="message">
                    <p><b>{g.title}</b></p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                      <small className="text-muted">{g.subject}</small>
                      <small style={{ color: days <= 3 ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                        {days <= 0 ? 'Hôm nay!' : `${days} ngày`}
                      </small>
                    </div>
                  </div>
                );
              })}

            {goals.filter(g => g.status === 'in_progress').length === 0 && (
              <p className="text-muted" style={{ padding: '0.5rem 0' }}>
                Không có mục tiêu đang thực hiện
              </p>
            )}
          </div>
        </div>

        {/* Tiến độ theo môn */}
        <div className="leaves" style={{ marginTop: '2rem' }}>
          <h2>Theo môn học</h2>
          {SUBJECTS.slice(0, 5).map(sub => {
            const subGoals = goals.filter(g => g.subject === sub);
            if (subGoals.length === 0) return null;
            const avg = Math.round(subGoals.reduce((s, g) => s + g.progress, 0) / subGoals.length);
            return (
              <div key={sub} style={{
                background: 'var(--color-white)',
                padding: '1rem var(--card-padding)',
                borderRadius: 'var(--border-radius-2)',
                marginBottom: '0.7rem',
                boxShadow: 'var(--box-shadow)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <small><b>{sub}</b></small>
                  <small className="text-muted">{avg}%</small>
                </div>
                <div style={{ height: '6px', background: 'var(--color-light)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${avg}%`,
                    background: 'var(--color-primary)',
                    borderRadius: '3px',
                    transition: 'width 400ms ease',
                  }} />
                </div>
              </div>
            );
          })}
          {goals.length === 0 && (
            <p className="text-muted">Chưa có dữ liệu</p>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Sub-component: ô thống kê nhỏ ──────────────────────────
function StatBox({ icon, color, label, value }: {
  icon: string;
  color: string;
  label: string;
  value: number;
}) {
  return (
    <div style={{
      background: 'var(--color-white)',
      padding: '1.2rem 1.5rem',
      borderRadius: 'var(--border-radius-2)',
      boxShadow: 'var(--box-shadow)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    }}>
      <span className="material-icons-sharp" style={{ color, fontSize: '1.8rem' }}>{icon}</span>
      <div>
        <h2 style={{ margin: 0 }}>{value}</h2>
        <small className="text-muted">{label}</small>
      </div>
    </div>
  );
}

// ─── Shared styles ───────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem 0.8rem',
  border: '1px solid var(--color-light)',
  borderRadius: 'var(--border-radius-1)',
  background: 'transparent',
  color: 'var(--color-dark)',
  fontFamily: 'inherit',
  fontSize: '0.88rem',
  outline: 'none',
};

const btnPrimaryStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.5rem 1.2rem',
  background: 'var(--color-primary)',
  color: '#fff',
  border: 'none',
  borderRadius: 'var(--border-radius-1)',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '0.85rem',
  transition: 'opacity 200ms ease',
};

const btnSecondaryStyle: React.CSSProperties = {
  ...btnPrimaryStyle,
  background: 'var(--color-light)',
  color: 'var(--color-dark)',
};

const iconBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--color-info)',
  display: 'flex',
  alignItems: 'center',
  padding: '0.2rem',
  borderRadius: '50%',
  transition: 'color 200ms ease',
};