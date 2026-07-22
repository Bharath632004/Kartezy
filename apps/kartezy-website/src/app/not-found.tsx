export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <h1 style={{
        fontSize: '6rem',
        fontWeight: 800,
        color: '#1976d2',
        margin: 0,
        lineHeight: 1,
      }}>
        404
      </h1>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 600,
        marginTop: '0.5rem',
        marginBottom: '0.5rem',
      }}>
        Page Not Found
      </h2>
      <p style={{
        color: '#666',
        marginBottom: '2rem',
        maxWidth: 400,
      }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <a
        href="/"
        style={{
          display: 'inline-block',
          backgroundColor: '#1976d2',
          color: 'white',
          padding: '0.75rem 2rem',
          borderRadius: 8,
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '1rem',
        }}
      >
        Go Home
      </a>
    </div>
  );
}
