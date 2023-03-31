import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect } from "react"
// routes
import FourOFour from '../views/404'
import Category from '../views/Category'
import Product from '../views/Product'
import Landing from '../views/Landing'
import Login from '../views/Login'
import Dashboard from '../views/Dashboard'

import Navbar from "../components/Navbar"

const Layout: any = ((View: any) => {
  return (
    <>
    <Navbar />
    <div className='max-w-7xl mx-auto'>
      { View }
    </div>
    </>
  )
})


const AppRouter = () => {
  const token = useSelector((state: any) => state.user.token)

  const PrivateOutlet = () => {
    return token ? <Outlet /> : <Navigate to="/" replace />;
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={Layout(<Landing />)} />
        <Route path='/category/:category' element={Layout(<Category />, 'Category')} />
        <Route path='/product/:category/:id' element={Layout(<Product />, 'Product')} />
        <Route path='/login' element={Layout(<Login />, 'Login')} />
        <Route path='/dashboard' element={<PrivateOutlet />}>
          <Route path='/dashboard' element={Layout(<Dashboard />, 'Dashboard')} />
        </Route>
        <Route path='*' element={Layout(<FourOFour />, "Not Found")} />
      </Routes>
    </Router>
  )
}

export default AppRouter