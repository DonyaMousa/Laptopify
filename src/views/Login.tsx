import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '../components/Icons/Spinner'
import { userActions } from '../store/userSlice'
import { useNavigate } from "react-router-dom"

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [user, setUser] = useState<any>({} || undefined)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Boolean>(false)
    const [success, setSuccess] = useState<Boolean>(false)
    
    const handleSubmit = async(e: any) => {
        e.preventDefault();
        setLoading(true)
        let data = await fetch('/api/login?' + new URLSearchParams({
            email,
            password
        }))
        await data.json().then((res: any) => {
            if(res.error) {
                setError(true)
            } else {
                setUser(res.user)
                setSuccess(true)
                setError(false)
                dispatch(userActions.signIn({name: res.user.name, email: res.user.email, token: res.user.pass}))
                navigate('/dashboard')
            }
        })
        setLoading(false)
    }

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto mt-60 lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        تسجيل الدخول
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#">
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">البريد الألكتروني</label>
                            <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">كلمة المرور</label>
                            <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" autoComplete="on" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <button onClick={(e) => handleSubmit(e)} className="w-full text-black bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-base px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                            {loading? <Spinner /> : 'تسجيل الدخول'}
                            
                        </button>
                        </form>
                    </div>
                </div>
                {error ? <label className='text-red-500 font-bold text-sm mt-4'>البريد الألكتروني أو كلمة المرور غير صحيحة</label> : null}
                {success ? <label className='text-green-500 font-bold text-sm mt-4'>تم تسجيل الدخول بنجاح</label> : null}
            </div>
        </section>
    )
}

export default Login