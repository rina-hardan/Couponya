import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for does not exist.</p>
      <Link to="/login" style={{ color: 'blue', textDecoration: 'underline' }} >
        Go back to login
      </Link>
    </div>
  );
}
