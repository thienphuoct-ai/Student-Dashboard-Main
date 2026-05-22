'use client';

import React from 'react';
import Link from 'next/link';

export default function PasswordPage() {
  return (
    <main 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        /* Thay vì 90vh dễ bị đẩy lệch bởi Header, dùng flex-grow hoặc minHeight vừa đủ */
        minHeight: 'calc(100vh - 100px)', 
        padding: '2rem'
      }}
    >
      <form 
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '16px', // Bo góc lớn hơn tạo cảm giác hiện đại
          padding: '3rem',
          backgroundColor: 'var(--color-white, #ffffff)', 
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)', // Đổ bóng mềm mại hơn
          width: '100%',
          maxWidth: '450px', // Nới rộng form ra một chút để form không bị gò bó
          color: 'var(--color-dark, #333)' // Đảm bảo text hiển thị tốt
        }}
      >
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Tạo mật khẩu mới
        </h2>
        
        <p style={{ 
          color: 'var(--color-info-dark, #7d8da1)', 
          fontSize: '0.95rem', 
          marginBottom: '2rem',
          lineHeight: '1.5'
        }}>
          Vui lòng nhập mật khẩu mới và xác nhận nó.
        </p>

        {/* Khối Input 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.2rem' }}>
          <label htmlFor="currentpass" style={{ fontWeight: '500', fontSize: '0.9rem', color: 'var(--color-dark-variant, #677483)' }}>
            Mật khẩu hiện tại
          </label>
          <input 
            type="password" 
            id="currentpass" 
            style={{
              border: '1.5px solid var(--color-info-light, #dce1eb)', // Viền dày và rõ nét hơn
              borderRadius: '8px',
              outline: 'none',
              background: 'transparent',
              padding: '0.8rem 1rem', // Tăng padding để input trông thoáng hơn
              fontSize: '1rem',
              color: 'inherit',
              transition: 'border-color 0.3s ease'
            }} 
          />
        </div>

        {/* Khối Input 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.2rem' }}>
          <label htmlFor="newpass" style={{ fontWeight: '500', fontSize: '0.9rem', color: 'var(--color-dark-variant, #677483)' }}>
            Mật khẩu mới
          </label>
          <input 
            type="password" 
            id="newpass" 
            style={{
              border: '1.5px solid var(--color-info-light, #dce1eb)',
              borderRadius: '8px',
              outline: 'none',
              background: 'transparent',
              padding: '0.8rem 1rem',
              fontSize: '1rem',
              color: 'inherit'
            }} 
          />
        </div>

        {/* Khối Input 3 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
          <label htmlFor="confirmpass" style={{ fontWeight: '500', fontSize: '0.9rem', color: 'var(--color-dark-variant, #677483)' }}>
            Xác nhận mật khẩu mới
          </label>
          <input 
            type="password" 
            id="confirmpass" 
            style={{
              border: '1.5px solid var(--color-info-light, #dce1eb)',
              borderRadius: '8px',
              outline: 'none',
              background: 'transparent',
              padding: '0.8rem 1rem',
              fontSize: '1rem',
              color: 'inherit'
            }} 
          />
        </div>

        {/* Cụm Nút bấm */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button 
            type="submit" 
            style={{
              backgroundColor: 'var(--color-primary, #7380ec)', // Màu nền cố định giúp nút nổi bật trên mọi theme
              color: '#ffffff', // Chữ màu trắng
              border: 'none',
              borderRadius: '8px',
              padding: '0.8rem 2rem',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(115, 128, 236, 0.2)', // Đổ bóng nhẹ cho nút
              transition: 'all 0.3s ease'
            }}
          >
            Lưu mật khẩu
          </button>
          
          <Link 
            href="/" 
            style={{ 
              color: 'var(--color-info-dark, #7d8da1)', 
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '1rem'
            }}
          >
            Hủy
          </Link>
        </div>

        {/* Link Quên mật khẩu */}
        <Link 
          href="#" 
          style={{ 
            marginTop: '1.5rem', 
            color: 'var(--color-primary, #7380ec)', 
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '600',
            textAlign: 'center'
          }}
        >
          Bạn không nhớ mật khẩu?
        </Link>
      </form>
    </main>
  );
}