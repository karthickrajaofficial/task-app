import React, { useState, useEffect } from 'react';
import { FaSignInAlt, FaSignOutAlt, FaLock } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';
import { signInWithPopup, signOut as firebaseSignOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth, provider } from '../firebase';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [resetEmail, setResetEmail] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate('/'); 
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Google Sign-In Success:', user);

      dispatch(login({ email: user.email, displayName: user.displayName }));

      navigate('/');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error('Google Sign-In failed. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      console.log('User signed out successfully');
      navigate('/login'); 
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Sign-Out failed. Please try again.');
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success('Password reset email sent! Check your inbox.');
      setIsResettingPassword(false);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      toast.error('Failed to send password reset email. Please try again.');
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-blue-100">
      <section className="max-w-md mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold flex justify-center items-center space-x-2 mb-4 text-purple-700">
          {user ? (
            <>
              <FaSignOutAlt className="text-3xl" /> <span>Logout</span>
            </>
          ) : (
            <>
              <FaSignInAlt className="text-3xl" /> <span>Login</span>
            </>
          )}
        </h1>

        {user ? (
          <div className="text-center">
            <p className="text-lg mb-6 text-gray-700">Welcome, {user.displayName || user.email}</p>
            <button
              onClick={handleSignOut}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-300"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            {isResettingPassword ? (
              <div className="text-center">
                <p className="text-lg mb-6 text-gray-600">Enter your email to reset your password</p>
                <div className="mb-4">
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="resetEmail"
                    name="resetEmail"
                    value={resetEmail}
                    placeholder="Enter your email"
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </div>
                <button
                  onClick={handlePasswordReset}
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Send Password Reset Email
                </button>
                <button
                  onClick={() => setIsResettingPassword(false)}
                  className="w-full mt-4 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition duration-300"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <>
                <p className="text-lg text-center mb-6 text-gray-600">Login and start tracking your tasks</p>
                <form onSubmit={onSubmit}>
                  <div className="mb-4">
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="email"
                      name="email"
                      value={email}
                      placeholder="Enter your email"
                      onChange={onChange}
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="password"
                      name="password"
                      value={password}
                      placeholder="Enter password"
                      onChange={onChange}
                    />
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                      Submit
                    </button>
                  </div>
                </form>

                <div className="mt-4">
                  <button
                    onClick={handleGoogleSignIn}
                    className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Sign in with Google
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-gray-600">
                    New User?{' '}
                    <a href="/register" className="text-blue-500 hover:underline">
                      Register here
                    </a>
                  </p>
                  <button
                    onClick={() => setIsResettingPassword(true)}
                    className="mt-4 text-blue-500 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default Login;
