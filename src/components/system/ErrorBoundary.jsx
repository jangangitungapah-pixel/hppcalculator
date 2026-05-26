import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
    console.error('[ErrorBoundary] Caught runtime error:', error, info);
  }

  handleReload() {
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'system-ui, sans-serif',
          background: '#FAFAFA',
          color: '#09090B'
        }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            background: '#fff',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            border: '1px solid #E4E4E7'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
              Terjadi Kesalahan
            </h1>
            <p style={{ color: '#71717A', fontSize: '0.875rem', margin: '0 0 1.5rem' }}>
              Aplikasi mengalami error tak terduga. Data kamu tetap aman di localStorage.
            </p>
            {this.state.error && (
              <details style={{
                background: '#F4F4F5',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                marginBottom: '1.5rem',
                fontSize: '0.75rem',
                color: '#71717A',
                wordBreak: 'break-all'
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Detail Error
                </summary>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {this.state.error.toString()}
                  {this.state.info?.componentStack}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReload}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#FF6A00',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Muat Ulang Aplikasi
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
