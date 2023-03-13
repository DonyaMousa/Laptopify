import { FC, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Product from "../components/Product"
import { ProductProvider } from '../context/ProductContext'
import axios from 'axios'
import useSWR from 'swr'

const fetcher = (url:any) => axios.get(url).then(res => res.data)

const Category: FC<any> = (() => {
    const { category, id } = useParams()
    const [product, setProduct] = useState<any>(undefined)
    const { data, error, isLoading } = useSWR(`/api/getProductById/?category=${category}&productId=${id}`, fetcher)

    useEffect(() => {
        setProduct(data?.product)
    }, [data])

    return (
        <>
            {isLoading ? 
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></div>
                </div> : 
                <ProductProvider productData={product}>
                    <Product />
                </ProductProvider>
            }
        </>
    )
})

export default Category