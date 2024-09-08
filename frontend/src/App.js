import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <>
      <Router>
        {/* Apply a background and min-height for all pages */}
        <div className='min-h-screen bg-gray-100 bg-cover bg-center'>
          <Header />
          <div className='container mx-auto'>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
            </Routes>
          </div>
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
