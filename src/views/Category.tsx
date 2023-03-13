import { FC, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from 'axios'
import useSWR from 'swr'

const fetcher = (url:any) => axios.get(url).then(res => res.data)

const Category: FC<any> = (() => {
    const navigate = useNavigate()
    const { category } = useParams()
    const [products, setProducts] = useState<any>([])
    const { data, error, isLoading } = useSWR(`/api/getAllByCategory/?category=${category}`, fetcher)

    useEffect(() => {
        console.log(data?.products)
        setProducts(data?.products)
    }, [data])

    return (
        <>
        {isLoading ?
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></div>
            </div> :
            <section className="grid h-screen place-items-center">
                <div className="px-4 mx-auto max-w-screen-xl text-center lg:py-16">

                    <h1 className="mb-10 text-4xl font-extrabold tracking-tight leading-none text-volta-gray-900 md:text-5xl lg:text-6xl text-black">تسوق و قارن</h1>
                    <p className="mb-20 text-base font-normal text-volta-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-volta-gray-50">قارن بين أفضل الأسعار علي منصات بيع المنتجات المختلفة مثل أمازون و ايباي</p>

                    <div className="flex">
                        <div className="w-96 ml-4 h-[800px] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <div className="font-bold text-lg px-6 py-3">عرض النتائج لـ</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                        {products && products.map((product: any, i: number) => (    
                            <div key={i} className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                <a href="#">
                                    <img className="p-8 rounded-t-lg" src={product.image} alt="product image" />
                                </a>
                                <div className="px-5 pb-5">
                                    <a href="#">
                                        <h5 onClick={() => navigate(`/product/${category}/${product._id}`)} className="text-lg font-normal tracking-tight text-gray-900 dark:text-white hover:underline cursor-pointer">{product.title}</h5>
                                    </a>
                                    {product.stars && (
                                        <div className="flex items-center mt-2.5 mb-5">
                                            {[...Array(Math.round(product.stars))].map((_, i) => (
                                                <svg key={i} aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Second star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                            ))}
                                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">{product.reviews}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{product.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </section>
        }
        </>
    )
})

export default Category