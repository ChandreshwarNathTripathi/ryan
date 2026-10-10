import React from 'react';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0A0F1D',
      color: '#F8FAFC',
      fontFamily: "'Outfit', 'Inter', sans-serif",
      padding: '24px',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '680px',
        padding: '48px',
        background: '#121A2D',
        borderRadius: '16px',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{
          display: 'inline-block',
          padding: '6px 16px',
          borderRadius: '999px',
          background: 'rgba(139, 92, 246, 0.15)',
          color: '#8B5CF6',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '16px'
        }}>
          Issue #1 Initialized • Mono-repo Skeleton
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0 0 16px', color: '#FFFFFF' }}>
          XSHostel Campus Living Platform
        </h1>

        <p style={{ fontSize: '1rem', color: '#94A3B8', lineHeight: 1.6, margin: '0 0 28px' }}>
          Monorepo architecture and base development environment successfully initialized.
          Ready for team members to work on their respective feature branches (Issues #2 through #10).
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          textAlign: 'left',
          background: '#0F172A',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Team Leader</span>
            <strong style={{ fontSize: '0.9rem', color: '#8B5CF6' }}>Syed Rayyan</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Frontend UI</span>
            <strong style={{ fontSize: '0.9rem', color: '#F8FAFC' }}>Member 2</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Backend DB</span>
            <strong style={{ fontSize: '0.9rem', color: '#F8FAFC' }}>Member 3</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Allocations</span>
            <strong style={{ fontSize: '0.9rem', color: '#F8FAFC' }}>Member 4</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
