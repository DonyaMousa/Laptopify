import { createBrowserRouter } from "react-router-dom"
// routes
import FourOFour from '../views/404'
import Category from '../views/Category'
import Product from '../views/Product'
import Landing from '../views/Landing'

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

const routesList = [
  {
    path: "/",
    element: Layout(<Landing />),
    errorElement: <FourOFour />
  },
  {
    path: "/category/:category",
    element: Layout(<Category />)
  },
  {
    path: "/product/:category/:id",
    element: Layout(<Product />)
  }
]

// router
const router = createBrowserRouter(routesList)

export default router
export const routes = routesList