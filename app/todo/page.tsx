'use client';

import React, { useState, useEffect } from 'react';

// ─── Kiểu dữ liệu ────────────────────────────────────────────
type Priority = 'high' | 'medium' | 'low';
type Status = 'todo' | 'done';

interface Task {
  id: string;
  title: string;
  subject: string;
  priority: Priority;
  status: Status;
  createdAt: string; // ISO date string
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

const PRIORITY_LABEL: Record<Priority, string> = {
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
};

const PRIORITY_COLOR: Record<Priority, string> = {
  high: 'var(--color-danger)',
  medium: 'var(--color-warning)',
  low: 'var(--color-success)',
};

// ─── Helpers ─────────────────────────────────────────────────
const generateId = () => `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const isToday = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};

// ─── Component chính ─────────────────────────────────────────
export default function TodoPage() {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'todo' | 'done'>('all');

  // Form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [priority, setPriority] = useState<Priority>('medium');

  // ✅ Thay bằng lazy initializer ngay trong useState:
  const [tasks, setTasks] = useState<Task[]>(() => {
  // typeof window check để tránh lỗi khi Next.js render phía server
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('ums_tasks');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
});

  // ── Lưu vào localStorage mỗi khi tasks thay đổi ─────────────
  useEffect(() => {
    localStorage.setItem('ums_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // ── Thêm task mới ────────────────────────────────────────────
  const handleAddTask = () => {
    if (!title.trim()) return; // Không thêm nếu tiêu đề rỗng

    const newTask: Task = {
      id: generateId(),
      title: title.trim(),
      subject,
      priority,
      status: 'todo',
      createdAt: new Date().toISOString(),
    };

    setTasks(prev => [newTask, ...prev]);

    // Reset form
    setTitle('');
    setSubject(SUBJECTS[0]);
    setPriority('medium');
    setShowForm(false);
  };

  // ── Toggle trạng thái done/todo ──────────────────────────────
  const handleToggle = (id: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, status: t.status === 'done' ? 'todo' : 'done' }
          : t
      )
    );
  };

  // ── Xóa task ─────────────────────────────────────────────────
  const handleDelete = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // ── Lọc tasks theo tab ───────────────────────────────────────
  const filteredTasks = tasks.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  // ── Tách nhóm: hôm nay / sắp tới ────────────────────────────
  const todayTasks = filteredTasks.filter(t => isToday(t.createdAt));
  const upcomingTasks = filteredTasks.filter(t => !isToday(t.createdAt));

  // ── Thống kê nhanh ───────────────────────────────────────────
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const todayCount = tasks.filter(t => isToday(t.createdAt) && t.status === 'todo').length;

  return (
    <>
      <main style={{ marginTop: '1.4rem' }}>
        {/* ── Tiêu đề trang ─────────────────────────────────── */}
        <h1>To-Do</h1>
        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
          Quản lý nhiệm vụ học tập hàng ngày
        </p>

        {/* ── Thống kê nhanh (3 ô) ──────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '1.8rem',
        }}>
          {/* Tổng nhiệm vụ */}
          <div style={cardStyle}>
            <span className="material-icons-sharp" style={{ color: 'var(--color-primary)', fontSize: '1.8rem' }}>
              assignment
            </span>
            <div>
              <h2 style={{ margin: 0 }}>{totalTasks}</h2>
              <small className="text-muted">Tổng nhiệm vụ</small>
            </div>
          </div>

          {/* Hôm nay chưa làm */}
          <div style={cardStyle}>
            <span className="material-icons-sharp" style={{ color: 'var(--color-warning)', fontSize: '1.8rem' }}>
              pending_actions
            </span>
            <div>
              <h2 style={{ margin: 0 }}>{todayCount}</h2>
              <small className="text-muted">Hôm nay cần làm</small>
            </div>
          </div>

          {/* Đã hoàn thành */}
          <div style={cardStyle}>
            <span className="material-icons-sharp" style={{ color: 'var(--color-success)', fontSize: '1.8rem' }}>
              task_alt
            </span>
            <div>
              <h2 style={{ margin: 0 }}>{doneTasks}</h2>
              <small className="text-muted">Đã hoàn thành</small>
            </div>
          </div>
        </div>

        {/* ── Thanh công cụ: filter + nút thêm ─────────────── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}>
          {/* Tabs filter */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['all', 'todo', 'done'] as const).map(f => (
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
                {f === 'all' ? 'Tất cả' : f === 'todo' ? 'Chưa làm' : 'Đã xong'}
              </button>
            ))}
          </div>

          {/* Nút thêm task */}
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              display: 'flex',
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
            }}
          >
            <span className="material-icons-sharp" style={{ fontSize: '1rem' }}>add</span>
            Thêm nhiệm vụ
          </button>
        </div>

        {/* ── Form thêm task (hiện/ẩn) ──────────────────────── */}
        {showForm && (
          <div style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--border-radius-2)',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: 'var(--box-shadow)',
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Nhiệm vụ mới</h3>

            {/* Tên nhiệm vụ */}
            <div style={{ marginBottom: '1rem' }}>
              <p className="text-muted" style={{ marginBottom: '0.3rem', lineHeight: 1.5 }}>
                Tên nhiệm vụ <span style={{ color: 'var(--color-danger)' }}>*</span>
              </p>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                placeholder="VD: Làm bài tập Toán chương 3..."
                style={inputStyle}
              />
            </div>

            {/* Môn học + Ưu tiên cùng hàng */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
              {/* Môn học */}
              <div>
                <p className="text-muted" style={{ marginBottom: '0.3rem', lineHeight: 1.5 }}>Môn học</p>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  style={inputStyle}
                >
                  {SUBJECTS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Mức độ ưu tiên */}
              <div>
                <p className="text-muted" style={{ marginBottom: '0.3rem', lineHeight: 1.5 }}>Mức độ ưu tiên</p>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as Priority)}
                  style={inputStyle}
                >
                  <option value="high">🔴 Cao</option>
                  <option value="medium">🟡 Trung bình</option>
                  <option value="low">🟢 Thấp</option>
                </select>
              </div>
            </div>

            {/* Nút hành động */}
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button onClick={handleAddTask} style={btnPrimaryStyle}>
                <span className="material-icons-sharp" style={{ fontSize: '1rem' }}>check</span>
                Lưu
              </button>
              <button
                onClick={() => setShowForm(false)}
                style={{ ...btnPrimaryStyle, background: 'var(--color-light)', color: 'var(--color-dark)' }}
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* ── Danh sách: Hôm nay ────────────────────────────── */}
        {todayTasks.length > 0 && (
          <section style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="material-icons-sharp" style={{ color: 'var(--color-primary)', fontSize: '1.1rem' }}>
                today
              </span>
              Hôm nay
            </h3>
            <TaskList tasks={todayTasks} onToggle={handleToggle} onDelete={handleDelete} />
          </section>
        )}

        {/* ── Danh sách: Trước đó ───────────────────────────── */}
        {upcomingTasks.length > 0 && (
          <section style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="material-icons-sharp" style={{ color: 'var(--color-info)', fontSize: '1.1rem' }}>
                history
              </span>
              Trước đó
            </h3>
            <TaskList tasks={upcomingTasks} onToggle={handleToggle} onDelete={handleDelete} />
          </section>
        )}

        {/* ── Trạng thái rỗng ───────────────────────────────── */}
        {filteredTasks.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'var(--color-white)',
            borderRadius: 'var(--card-border-radius)',
            boxShadow: 'var(--box-shadow)',
          }}>
            <span className="material-icons-sharp" style={{ fontSize: '3rem', color: 'var(--color-info)' }}>
              checklist
            </span>
            <h3 style={{ marginTop: '0.5rem' }}>Chưa có nhiệm vụ nào</h3>
            <p className="text-muted">Bấm &quot;Thêm nhiệm vụ&quot; để bắt đầu</p>
          </div>
        )}
      </main>

      {/* ── Cột phải: Tóm tắt theo môn ───────────────────────── */}
      <div className="right">
        <div className="announcements">
          <h2>Theo môn học</h2>
          <div className="updates">
            {SUBJECTS.slice(0, 5).map(sub => {
              const subTasks = tasks.filter(t => t.subject === sub);
              const subDone = subTasks.filter(t => t.status === 'done').length;
              if (subTasks.length === 0) return null;

              return (
                <div key={sub} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--color-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <small><b>{sub}</b></small>
                    <small className="text-muted">{subDone}/{subTasks.length}</small>
                  </div>
                  {/* Progress bar đơn giản */}
                  <div style={{
                    height: '6px',
                    background: 'var(--color-light)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: subTasks.length > 0 ? `${(subDone / subTasks.length) * 100}%` : '0%',
                      background: 'var(--color-primary)',
                      borderRadius: '3px',
                      transition: 'width 400ms ease',
                    }} />
                  </div>
                </div>
              );
            })}

            {tasks.length === 0 && (
              <p className="text-muted" style={{ padding: '0.5rem 0' }}>
                Chưa có dữ liệu
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Sub-component: danh sách task ───────────────────────────
function TaskList({
  tasks,
  onToggle,
  onDelete,
}: {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {tasks.map(task => (
        <div
          key={task.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'var(--color-white)',
            padding: '1rem 1.4rem',
            borderRadius: 'var(--border-radius-2)',
            boxShadow: 'var(--box-shadow)',
            transition: 'box-shadow 300ms ease, opacity 300ms ease',
            opacity: task.status === 'done' ? 0.6 : 1,
            // Đường kẻ bên trái màu theo priority
            borderLeft: `4px solid ${PRIORITY_COLOR[task.priority]}`,
          }}
        >
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={task.status === 'done'}
            onChange={() => onToggle(task.id)}
            style={{ width: '1.1rem', height: '1.1rem', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
          />

          {/* Nội dung */}
          <div style={{ flex: 1 }}>
            <p style={{
              margin: 0,
              fontWeight: 500,
              color: 'var(--color-dark)',
              textDecoration: task.status === 'done' ? 'line-through' : 'none',
            }}>
              {task.title}
            </p>
            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.2rem' }}>
              <small className="text-muted">{task.subject}</small>
              <small style={{ color: PRIORITY_COLOR[task.priority] }}>
                ● {PRIORITY_LABEL[task.priority]}
              </small>
            </div>
          </div>

          {/* Nút xóa */}
          <button
            onClick={() => onDelete(task.id)}
            title="Xóa nhiệm vụ"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-info)',
              display: 'flex',
              alignItems: 'center',
              padding: '0.2rem',
              borderRadius: '50%',
              transition: 'color 200ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-danger)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-info)')}
          >
            <span className="material-icons-sharp" style={{ fontSize: '1.1rem' }}>delete_outline</span>
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Shared styles (tái sử dụng) ────────────────────────────
const cardStyle: React.CSSProperties = {
  background: 'var(--color-white)',
  padding: '1.2rem 1.5rem',
  borderRadius: 'var(--border-radius-2)',
  boxShadow: 'var(--box-shadow)',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  transition: 'box-shadow 300ms ease',
};

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
  display: 'flex',
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