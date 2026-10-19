import React from 'react';

export default function DeveloperProfile() {
  const dev = {
    username: "ArkanRoot",
    role: "Full Stack Developer",
    stack: ["JavaScript", "Java", "React", "Node.js", "Docker", "Linux"],
    command: "npm run build-future"
  };

  return (
    <div style={{
      background: '#0e0d0d',
      color: '#00ff88',
      fontFamily: 'monospace',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #00ff88',
      maxWidth: '320px',
      boxShadow: '0 0 15px rgba(0, 255, 136, 0.2)'
    }}>
      <h3 style={{ margin: '0 0 8px 0', color: '#fff' }}>
        &gt; {dev.username}
      </h3>
      <p style={{ color: '#888', margin: '0 0 16px 0', fontSize: '14px' }}>
        {dev.role}
      </p>
      
      <div style={{ marginBottom: '16px', fontSize: '13px', color: '#c7c7c7' }}>
        <strong>Tech Stack:</strong>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
          {dev.stack.map((tech) => (
            <span key={tech} style={{
              background: 'rgba(0, 255, 136, 0.1)',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
              border: '1px solid rgba(0, 255, 136, 0.3)'
            }}>
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid #222', paddingTop: '12px', fontSize: '12px', color: '#555' }}>
        $ {dev.command}
      </div>
    </div>
  );
}