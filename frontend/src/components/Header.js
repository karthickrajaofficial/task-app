import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <header className='bg-gray-800 text-white py-4 w-full'>
      <div className='container mx-auto flex justify-between items-center px-4'>
        {/* Logo */}
        <div className='logo'>
          <Link to='/' className='text-2xl font-bold'>
            Task Manager
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className='flex space-x-6'>
          {user ? (
            <li>
              <button
                className='flex items-center space-x-2 bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition duration-300'
                onClick={onLogout}
              >
                <FaSignOutAlt /> <span>Logout</span>
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link
                  to='/login'
                  className='flex items-center space-x-2 bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300'
                >
                  <FaSignInAlt /> <span>Login</span>
                </Link>
              </li>
              <li>
                <Link
                  to='/register'
                  className='flex items-center space-x-2 bg-green-500 px-4 py-2 rounded-md hover:bg-green-600 transition duration-300'
                >
                  <FaUser /> <span>Register</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  )
}

export default Header
