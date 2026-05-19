'use client';

import React, { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { dayNames } from "./constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata không thể dùng trong Client Component, nên ta bỏ export metadata ở đây 
// (Nếu cần SEO, bạn có thể tạo một file layout riêng cho Server hoặc dùng component con)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Khởi tạo Theme từ LocalStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('dark-theme') === 'true';
    setIsDarkMode(savedTheme);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lưu Theme khi thay đổi
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('dark-theme', newTheme.toString());
  };

  // Gửi sự kiện mở Timetable cho Page.tsx
  const triggerTimetable = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('toggle-timetable'));
  };

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp" rel="stylesheet" />
      </head>
      <body className={`${isDarkMode ? 'dark-theme' : ''} ${geistSans.variable} ${geistMono.variable}`}>
        <header className={isScrolled ? 'active' : ''}>
          <div className="logo" title="University Management System">
            <img src="/images/logo.png" alt="Logo" style={{ width: '2rem' }} />
            <h2>U<span className="danger">M</span>S</h2>
          </div>
          <div className="navbar">
            <Link href="/" className="active">
              <span className="material-icons-sharp">home</span>
              <h3>Home</h3>
            </Link>
            <a href="#" onClick={triggerTimetable}>
              <span className="material-icons-sharp">today</span>
              <h3>Time Table</h3>
            </a>
            <Link href="/exam">
              <span className="material-icons-sharp">grid_view</span>
              <h3>Examination</h3>
            </Link>
            <Link href="/password">
              <span className="material-icons-sharp">password</span>
              <h3>Change Password</h3>
            </Link>
            <a href="#" onClick={() => console.log("Logout")}>
              <span className="material-icons-sharp">logout</span>
              <h3>Logout</h3>
            </a>
          </div>
          <div id="profile-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <span className="material-icons-sharp">person</span>
          </div>
          <div className="theme-toggler" onClick={toggleTheme}>
            <span className={`material-icons-sharp ${!isDarkMode ? 'active' : ''}`}>light_mode</span>
            <span className={`material-icons-sharp ${isDarkMode ? 'active' : ''}`}>dark_mode</span>
          </div>
        </header>

        <div className="container">
          <aside className={isSidebarOpen ? 'active' : ''}>
            <div className="profile">
              <div className="top">
                <div className="profile-photo">
                  <img src="/images/profile-1.jpg" alt="Profile" />
                </div>
                <div className="info">
                  <p>Hey, <b>Alex</b></p>
                  <small className="text-muted">12102030</small>
                </div>
              </div>
              <div className="about">
                <h5>Course</h5>
                <p>BTech. CSE</p>
                <h5>DOB</h5>
                <p>29-Feb-2020</p>
                <h5>Email</h5>
                <p>unknown@gmail.com</p>
              </div>
            </div>
          </aside>
          {children}
        </div>
      </body>
    </html>
  );
}
