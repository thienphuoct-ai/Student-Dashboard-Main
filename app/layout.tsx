'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});
// Lấy basePath tự động theo môi trường
const basePath = process.env.NODE_ENV === 'production' 
  ? '/Student-Dashboard-Main' 
  : '';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // ── Theme: đọc từ localStorage ngay khi khởi tạo ────────────
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('dark-theme') === 'true';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled]       = useState(false);

  // State điều khiển dropdown "Học tập"
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Ref để detect click bên ngoài dropdown → tự đóng
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lấy pathname hiện tại để highlight active link
  const pathname = usePathname();

  // ── Scroll handler ───────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
      setIsSidebarOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Click ngoài dropdown thì đóng ───────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Toggle theme ─────────────────────────────────────────────
  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('dark-theme', next.toString());
  };

  // ── Helper: kiểm tra link có đang active không ───────────────
  const isActive = (href: string) => pathname === href;

  // ── Dropdown "Học tập" active nếu đang ở /todo hoặc /goals ──
  const isStudyActive = pathname === '/todo' || pathname === '/goals';

  return (
    <html lang="vi">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${isDarkMode ? 'dark-theme' : ''} ${geistSans.variable} ${geistMono.variable}`}
      >
        {/* ════════════════════════════════════════════════════
            HEADER
        ════════════════════════════════════════════════════ */}
        <header className={isScrolled ? 'active' : ''}>
          {/* Logo */}
          <div className="logo" title="University Management System">
            <Image src={`${basePath}/images/logo.png`} alt="Logo" width={32} height={32} />
            <h2>U<span className="danger">M</span>S</h2>
          </div>

          {/* Navbar */}
          <div className="navbar">

            {/* Home */}
            <Link href="/" className={isActive('/') ? 'active' : ''}>
              <span className="material-icons-sharp">home</span>
              <h3>Home</h3>
            </Link>

            {/* Time Table */}
            <Link href="/timetable" className={isActive('/timetable') ? 'active' : ''}>
              <span className="material-icons-sharp">today</span>
              <h3>Time Table</h3>
            </Link>

            {/* Examination */}
            <Link href="/exam" className={isActive('/exam') ? 'active' : ''}>
              <span className="material-icons-sharp">grid_view</span>
              <h3>Examination</h3>
            </Link>

            {/* ── Dropdown: Học tập ── */}
            <div
              ref={dropdownRef}
              style={{ position: 'relative' }}
            >
              {/* Nút trigger dropdown */}
              <a
                href="#"
                onClick={e => { e.preventDefault(); setIsDropdownOpen(p => !p); }}
                className={isStudyActive ? 'active' : ''}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: '3.7rem', padding: '0 2rem', transition: 'all 300ms ease', cursor: 'pointer' }}
              >
                <span className="material-icons-sharp">school</span>
                <h3>Học tập</h3>
                {/* Mũi tên xoay khi mở */}
                <span
                  className="material-icons-sharp"
                  style={{
                    fontSize: '1rem',
                    transition: 'transform 250ms ease',
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                >
                  expand_more
                </span>
              </a>

              {/* Menu dropdown */}
              {isDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--color-white)',
                  borderRadius: 'var(--border-radius-2)',
                  boxShadow: '0 1rem 2rem var(--color-light)',
                  minWidth: '160px',
                  zIndex: 2000,
                  overflow: 'hidden',
                  // Hiệu ứng fade-in nhẹ
                  animation: 'dropdownFadeIn 200ms ease',
                }}>
                  {/* To-Do */}
                  <Link
                    href="/todo"
                    onClick={() => setIsDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      padding: '0.9rem 1.2rem',
                      color: isActive('/todo') ? 'var(--color-primary)' : 'var(--color-dark)',
                      background: isActive('/todo') ? 'var(--color-light)' : 'transparent',
                      borderBottom: '1px solid var(--color-light)',
                      transition: 'background 200ms ease',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => { if (!isActive('/todo')) (e.currentTarget as HTMLElement).style.background = 'var(--color-light)'; }}
                    onMouseLeave={e => { if (!isActive('/todo')) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <span className="material-icons-sharp" style={{ fontSize: '1.1rem' }}>checklist</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>To-Do</span>
                  </Link>

                  {/* Goals */}
                  <Link
                    href="/goals"
                    onClick={() => setIsDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      padding: '0.9rem 1.2rem',
                      color: isActive('/goals') ? 'var(--color-primary)' : 'var(--color-dark)',
                      background: isActive('/goals') ? 'var(--color-light)' : 'transparent',
                      transition: 'background 200ms ease',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => { if (!isActive('/goals')) (e.currentTarget as HTMLElement).style.background = 'var(--color-light)'; }}
                    onMouseLeave={e => { if (!isActive('/goals')) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <span className="material-icons-sharp" style={{ fontSize: '1.1rem' }}>flag</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>Goals</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Logout */}
            <a href="#" onClick={() => console.log('Logout')}>
              <span className="material-icons-sharp">logout</span>
              <h3>Logout</h3>
            </a>
          </div>

          {/* Nút mở sidebar mobile */}
          <div
            id="profile-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <span className="material-icons-sharp">person</span>
          </div>

          {/* Theme toggler */}
          <div className="theme-toggler" onClick={toggleTheme}>
            <span className={`material-icons-sharp ${!isDarkMode ? 'active' : ''}`}>
              light_mode
            </span>
            <span className={`material-icons-sharp ${isDarkMode ? 'active' : ''}`}>
              dark_mode
            </span>
          </div>
        </header>

        {/* ════════════════════════════════════════════════════
            CONTAINER CHÍNH
        ════════════════════════════════════════════════════ */}
        <div className="container">
          {/* ── Sidebar trái: Profile + Change Password ── */}
          <aside className={isSidebarOpen ? 'active' : ''}>
            <div className="profile">
              {/* Ảnh + tên */}
              <div className="top">
                <div className="profile-photo">
                  <Image
                    src="/images/profile-1.jpg"
                    alt="Profile"
                    width={96}
                    height={96}
                  />
                </div>
                <div className="info">
                  <p>Hey, <b>Alex</b></p>
                  <small className="text-muted">12102030</small>
                </div>
              </div>

              {/* Thông tin cá nhân */}
              <div className="about">
                <h5>Course</h5>
                <p>BTech. CSE</p>
                <h5>DOB</h5>
                <p>29-Feb-2020</p>
                <h5>Email</h5>
                <p>thienphuoct97@gmail.com</p>
              </div>

              {/* Change Password chuyển xuống sidebar */}
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--color-light)', paddingTop: '1rem' }}>
                <Link
                  href="/password"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--border-radius-1)',
                    background: isActive('/password') ? 'var(--color-light)' : 'transparent',
                    color: isActive('/password') ? 'var(--color-primary)' : 'var(--color-info)',
                    transition: 'all 200ms ease',
                    textDecoration: 'none',
                  }}
                >
                  <span className="material-icons-sharp" style={{ fontSize: '1.1rem' }}>password</span>
                  <h5 style={{ margin: 0, fontWeight: 500 }}>Change Password</h5>
                </Link>
              </div>
            </div>
          </aside>

          {/* Nội dung trang con */}
          {children}
        </div>

        {/* Animation dropdown */}
        <style>{`
          @keyframes dropdownFadeIn {
            from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
            to   { opacity: 1; transform: translateX(-50%) translateY(0);    }
          }
        `}</style>
      </body>
    </html>
  );
}