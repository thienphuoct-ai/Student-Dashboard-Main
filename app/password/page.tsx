'use client';

import React from 'react';
import Link from 'next/link';

export default function PasswordPage() {
  return (
    <main>
      <div 
        className="change-password-container" 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '90vh'
        }}
      >
        <form 
          action="" 
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRadius: 'var(--border-radius-2)',
            padding: '3.5rem',
            backgroundColor: 'var(--color-white)',
            boxShadow: 'var(--box-shadow)',
            width: '95%',
            maxWidth: '32rem'
          }}
        >
          <h2>Create new password</h2>
          <p className="text-muted" style={{ margin: '0.4rem 0 1.2rem 0' }}>
            Your new password must be different from previous used passwords.
          </p>
          
          <div className="box" style={{ padding: '0.5rem 0' }}>
            <p className="text-muted" style={{ lineHeight: 2 }}>Current Password</p>
            <input 
              type="password" 
              id="currentpass" 
              style={{
                border: '1px solid var(--color-light)',
                outline: 'none',
                background: 'transparent',
                height: '2rem',
                width: '100%',
                padding: '0 .5rem'
              }} 
            />
          </div>

          <div className="box" style={{ padding: '0.5rem 0' }}>
            <p className="text-muted" style={{ lineHeight: 2 }}>New Password</p>
            <input 
              type="password" 
              id="newpass" 
              style={{
                border: '1px solid var(--color-light)',
                outline: 'none',
                background: 'transparent',
                height: '2rem',
                width: '100%',
                padding: '0 .5rem'
              }} 
            />
          </div>

          <div className="box" style={{ padding: '0.5rem 0' }}>
            <p className="text-muted" style={{ lineHeight: 2 }}>Confirm Password</p>
            <input 
              type="password" 
              id="confirmpass" 
              style={{
                border: '1px solid var(--color-light)',
                outline: 'none',
                background: 'transparent',
                height: '2rem',
                width: '100%',
                padding: '0 .5rem'
              }} 
            />
          </div>

          <div className="button">
            <input type="submit" value="Save" className="btn" />
            <Link href="/" className="text-muted">Cancel</Link>
          </div>
          <Link href="#"><p style={{ marginTop: '1rem' }}>Forget password?</p></Link>
        </form>
      </div>
    </main>
  );
}