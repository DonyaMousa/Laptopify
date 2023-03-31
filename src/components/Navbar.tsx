import { FC, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
// import useCurrentPath from "../hooks/useCurrentPath"

const Navbar: FC<Record<string, never>> = (() => {
  const navigate = useNavigate()
  const token = useSelector((state: any) => state.user.token)
  // const currentPath = useCurrentPath()
  const [dropDownOpen, setDropDownOpen] = useState(false)

  const openCategory = (category: string) => {
    navigate(`/category/${category}`)
    setDropDownOpen(!dropDownOpen)
  }

  const openDashboard = () => {
    if(token) navigate('/dashboard')
    else navigate('/login')
  }

  const isActiveClass = ((pathname: string) => {
    // const classProps = currentPath![0].pathname === pathname ?
    // "block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white" 
    // :
    // "block py-2 pr-4 pl-3rounded border-b border-volta-gray-100 hover:bg-volta-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-volta-gray-100 lg:dark:hover:text-white dark:hover:bg-volta-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-volta-gray-700"
    // return classProps
    return ''
  })

  return (
    <>
    <header>
      <nav className="bg-white border-volta-gray-200 h-[60px] px-4 lg:px-6 py-4 dark:bg-volta-gray-900 border-b border-b-volta-gray-500">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <button onClick={() => navigate('/')} className="flex items-center">
            <span className="text-xl self-start font-extrabold whitespace-nowrap text-black">Laptopify</span>
          </button>
          <div className="items-center flex lg:hidden lg:order-2">
            <button data-collapse-toggle="mobile-menu-2" type="button" className="inline-flex items-center p-2 ml-1 text-sm text-volta-gray-500 rounded-lg lg:hidden hover:bg-volta-gray-100 focus:outline-none focus:ring-2 focus:ring-volta-gray-200 dark:text-volta-gray-400 dark:hover:bg-volta-gray-700 dark:focus:ring-volta-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
              <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
          </div>
          <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li></li>
              <li>
                <button onClick={() => navigate('/')} className={isActiveClass('/wrapper')}>
                  الصفحة الرئيسية
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact-us')} className={isActiveClass('/vaults')}>
                  تواصل معنا
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about-us')} className={isActiveClass('/vaults')}>
                  معلومات عنا
                </button>
              </li>
              <li>
                <button onClick={() => setDropDownOpen(!dropDownOpen)} id="dropdownDelayButton" className="w-[150px]" data-dropdown-toggle="dropdownDelay" data-dropdown-delay="500" data-dropdown-trigger="hover" type="button">
                  <div className="flex flex-row">
                    <div>
                      الأقسام
                    </div>
                    <div>
                      <svg className="w-4 h-4 mt-1.5 mr-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </button>
                {dropDownOpen && (
                <div id="dropdownDelay" className="z-10 fixed bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDelayButton">
                    <li>
                      <a onClick={() => openCategory('laptops')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">أجهزة اللابتوب</a>
                    </li>
                    <li>
                      <a onClick={() => openCategory('mobiles')} href="#" className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">الجوالات</a>
                    </li>
                    <li>
                      <a onClick={() => openCategory('tvs')} href="#" className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">التلفزيونات</a>
                    </li>
                    <li>
                      <a onClick={() => openCategory('tablets')} href="#" className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">التابليت</a>
                    </li>
                    <li>
                      <a onClick={() => openCategory('cameras')} href="#" className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">الكاميرات</a>
                    </li>
                  </ul>
                </div>
                )}
              </li>
            </ul>
          </div>
          <div className="lg:order-2">
            <a onClick={() => openDashboard()} className="flex font-medium text-gray-700 items-center cursor-pointer">
              {token ?
              'لوحة التحكم':
              'تسجيل الدخول'}
            </a>
          </div>
        </div>
      </nav>
    </header>
  </>
  )
})

export default Navbar
