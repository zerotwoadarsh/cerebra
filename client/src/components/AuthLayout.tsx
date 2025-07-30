import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * A layout component that checks if a user is authenticated.
 * - If a token is found in localStorage, it redirects the user to the /dashboard.
 * - If no token is found, it renders the child components (e.g., Signin or Signup page).
 * This prevents logged-in users from accessing the auth pages.
 */
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for the authentication token in local storage.
    const token = localStorage.getItem('token');

    if (token) {
      // If the token exists, the user is logged in.
      // Redirect them to the dashboard immediately.
      // { replace: true } prevents them from using the back button to return to the auth page.
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  // If there's no token, render the children (the Signin or Signup page).
  return <>{children}</>;
};

export default AuthLayout;
