import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Hero from './pages/Hero'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import ShareBrain from './pages/ShareBrain'
import { ThemeProvider } from './context/themeContext'
import { Navigate } from 'react-router-dom'
import AuthLayout from './components/AuthLayout' // Import the new layout

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Hero />} />

          {/* Wrap the auth routes with the AuthLayout */}
          <Route 
            path="/signin" 
            element={
              <AuthLayout>
                <Signin />
              </AuthLayout>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <AuthLayout>
                <Signup />
              </AuthLayout>
            } 
          />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/brain/:shareLink" element={<ShareBrain />}></Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
