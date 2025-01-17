import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { FC, useEffect, useState, Fragment } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { categories } from '../constants'
import ReactStars from 'react-stars'
import arraySort from 'array-sort'
import axios from 'axios'
import useSWR from 'swr'
import shipping from '../assets/shipping.png'
import { FaAlignJustify, FaAlignLeft } from 'react-icons/fa'
import handlecompare from '../components/compare'
import Products from '../components/compare'


const sortOptions = [
  { name: 'الأكثر شهرة', key: 'Popularity'},
  { name: 'أعلي تقييم', key: 'Rating'},
  { name: 'السعر: من الأدنى الى الأعلى', key: 'priceUp'},
  { name: 'السعر: من الأعلى الى الأدنى', key: 'priceDown'},
]

const compareProductsPlaceholder = [
    'المنتج الأول',
    'المنتج الثاني',
    'المنتج الثالث',
    'المنتج الرابع',
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const fetcher = (url:any) => axios.get(url).then(res => res.data)

const Category: FC<any> = () => {
    const navigate = useNavigate()
    const { category } = useParams()
    const { data, error, isLoading } = useSWR(`/api/getAllByCategory/?category=${category}`, fetcher)


    const [products, setProducts] = useState<any>([])
    const [filteredProducts, setFilteredProducts] = useState<any>([])
    const [filtersKeys, setFiltersKeys] = useState<any>([])
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [selectedFilters, setSelectedFilters] = useState<any>([])
    const [sortBy, setSortBy] = useState(sortOptions[0])
    const [sortedProducts, setSortedProducts] = useState<any>([])
    const [comparedProducts, setComparedProducts] = useState<any>([])
    const [placesholder, setPlaceholder] = useState<any>([])


    const handleComparedProducts = (product: any) => {
        if(comparedProducts.includes(product)) {
            let newComparedProducts = [...comparedProducts]
            newComparedProducts.splice(newComparedProducts.indexOf(product), 1)
            setComparedProducts(newComparedProducts)
        } else {
            if(comparedProducts.length === 4) return alert('لا يمكنك مقارنة أكثر من 4 منتجات')
            let newComparedProducts = [...comparedProducts]
            newComparedProducts.indexOf(product) === -1 ? newComparedProducts.push(product) : null
            setComparedProducts(newComparedProducts)
        }
    }


    const getProductsFilters = (products: any) => {
        const keys = new Set()
        products.forEach((product: any) => {
            Object.keys(product.details).forEach((key: any) => {
                keys.add(key)
            })
        })

        const keysArray = Array.from(keys)
        let options : any[] = []
        let filters : any[] = []
        keysArray.forEach((key: any, i: number) => {
            const filter = {
                id: i,
                name: key,
                options
            }
            products.forEach((product: any) => {
                const k = product.details[key]
                k && !filter.options.includes(k) ? filter.options.push(k) : null
            })
            options = []
            filters.push(filter)
        })
        return filters
    }

    const handleFilter = (filter: any) => {
        let newFilters = [...selectedFilters]
        newFilters.indexOf(filter) === -1 ? newFilters.push(filter) : newFilters.splice(newFilters.indexOf(filter), 1)
        setSelectedFilters(newFilters)
    }

    useEffect(() => {
        if (data?.products) {
            setFiltersKeys(getProductsFilters(data?.products))
            setProducts(data?.products)
            setFilteredProducts(data?.products)
        }
    }, [data])

    useEffect(() => {
        let placeholderEles:JSX.Element[] = []
        compareProductsPlaceholder.forEach((placeholder, index) => {
            if(index >= comparedProducts.length) {
                placeholderEles.push(
                    <div key={index} className="w-[300px] flex flex-col justify-center text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                        <h5 className='font-semibold text-center text-gray-400'>{placeholder}</h5>
                    </div>
                )
            }
        })
        setPlaceholder(placeholderEles)
    }, [comparedProducts])

    useEffect(() => {
        if (sortBy) {
            let sortedProducts = [...filteredProducts].map((product: any) => {
                console.log(product)
                product.price = product.price.replace(/\D/g,'')
                product.price = Number.parseFloat(product.price)
                return product
            })
            switch (sortBy.key) {
                case 'Popularity':
                    sortedProducts = arraySort(sortedProducts, 'reviews', { reverse: true })
                    break
                case 'Rating':
                    sortedProducts = arraySort(sortedProducts, 'stars', { reverse: true })
                    break
                case 'priceUp':
                    sortedProducts = arraySort(sortedProducts, 'price')
                    break
                case 'priceDown':
                    sortedProducts = arraySort(sortedProducts, 'price', { reverse: true })
                    break
                default:
                    break
            }
            sortedProducts = sortedProducts.map((product: any) => {
                product.price = product.price.toString()
                product.price = product.price.slice(0, -2) + '.' + product.price.slice(-2)
                product.price = product.price + ' ريال'
                return product
            })
            setSortedProducts(sortedProducts)
        }
    }, [filteredProducts, sortBy])

    useEffect(() => {
        if (selectedFilters.length > 0) {
            let filteredProducts = products.filter((product: any) => {
                let traits = Object.values(product.details)
                let p = undefined
                selectedFilters.map((filter: any) => {
                    if(traits.includes(filter)) {
                        p = product
                    }
                })
                if(p) return p
            })
            setFilteredProducts(filteredProducts)
            console.log(filteredProducts)
        } else {
            setFilteredProducts(products)
        }
    }, [selectedFilters])

    return (
        <div className="bg-white">
            <div>
                {/* Mobile filter dialog */}
                <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
                        <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-40 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <Dialog.Panel className="relative ml-auto pr-5 flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                            <div className="flex items-center justify-between px-4">
                                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                <button
                                type="button"
                                className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                                onClick={() => setMobileFiltersOpen(false)}
                                >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>

                            {/* Filters */}
                            <form className="mt-4 border-t border-gray-200">
                            {filtersKeys.map((section) => (
                                <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6">
                                    {({ open }) => (
                                    <>
                                        <h3 className="-my-3 flow-root">
                                        <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                            <span className="font-medium text-gray-900">{section.name}</span>
                                            <span className="ml-6 flex items-center">
                                            {open ? (
                                                <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                            ) : (
                                                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                            )}
                                            </span>
                                        </Disclosure.Button>
                                        </h3>
                                        <Disclosure.Panel className="pt-6">
                                        <div className="space-y-4">
                                            {section.options.map((option, optionIdx) => (
                                            <div key={option} className="flex items-center">
                                                <input
                                                id={`filter-${section.id}-${optionIdx}`}
                                                name={`${section.id}[]`}
                                                defaultValue={option}
                                                type="checkbox"
                                                defaultChecked={selectedFilters?.includes(option)}
                                                onClick={() => {handleFilter(option)}}
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                    <label
                                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                                    className="mr-3 text-sm text-gray-600"
                                                    >
                                                        {option}
                                                    </label>
                                            </div>
                                            ))}
                                        </div>
                                        </Disclosure.Panel>
                                    </>
                                    )}
                                </Disclosure>
                                ))}
                            </form>
                            </Dialog.Panel>
                        </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-baseline justify-between border-b border-gray-200 py-6">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">{category ? categories[category] : 'Tablebt'}</h1>
                    

                    <div className="flex items-center">
                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                        <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                            ترتيب حسب :  
                            <strong className='mr-1'>{sortBy.name}</strong>
                            <ChevronDownIcon
                            className="ml-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                            />
                        </Menu.Button>
                        </div>

                        <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                        >
                        <Menu.Items className="absolute -right-[100px] z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                            {sortOptions.map((option) => (
                                <Menu.Item key={option.name}>
                                {({ active }) => (
                                    <div
                                    onClick={() => {setSortBy(option)}}
                                    className={classNames(
                                        option.name === sortBy.name ? 'font-medium text-gray-900 text-right cursor-pointer' : 'text-gray-500 text-right cursor-pointer',
                                        active ? 'bg-gray-100' : '',
                                        'block px-4 py-2 text-sm'
                                    )}
                                    >
                                    {option.name}
                                    </div>
                                )}
                                </Menu.Item>
                            ))}
                            </div>
                        </Menu.Items>
                        </Transition>
                    </Menu>

                    <button
                        type="button"
                        className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                        onClick={() => setMobileFiltersOpen(true)}
                    >
                        <span className="sr-only">Filters</span>
                        <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    </div>
                </div>

                <section aria-labelledby="products-heading" className="pt-6 pb-24">
                    <h2 id="products-heading" className="sr-only">
                    Products
                    </h2>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                    {/* Filters */}
                    <form className="hidden lg:block">
                        {/* <h3 className="sr-only">Categories</h3>
                        <ul role="list" className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                        {subCategories.map((category) => (
                            <li key={category.name}>
                            <a href={category.href}>{category.name}</a>
                            </li>
                        ))}
                        </ul> */}

                        {filtersKeys.map((section) => (
                        <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6">
                            {({ open }) => (
                            <>
                                <h3 className="-my-3 flow-root">
                                <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                    <span className="font-medium text-gray-900">{section.name}</span>
                                    <span className="ml-6 flex items-center">
                                    {open ? (
                                        <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                    ) : (
                                        <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                    )}
                                    </span>
                                </Disclosure.Button>
                                </h3>
                                <Disclosure.Panel className="pt-6">
                                <div className="space-y-4">
                                    {section.options.map((option, optionIdx) => (
                                    <div key={option} className="flex items-center">
                                        <input
                                        id={`filter-${section.id}-${optionIdx}`}
                                        name={`${section.id}[]`}
                                        defaultValue={option}
                                        type="checkbox"
                                        defaultChecked={selectedFilters?.includes(option)}
                                        onClick={() => {handleFilter(option)}}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                            <label
                                            htmlFor={`filter-${section.id}-${optionIdx}`}
                                            className="mr-3 text-sm text-gray-600"
                                            >
                                                {option}
                                            </label>
                                    </div>
                                    ))}
                                </div>
                                </Disclosure.Panel>
                            </>
                            )}
                        </Disclosure>
                        ))}
                    </form>
                    {/* Product grid */}
                    
                    <div className="lg:col-span-3">
                        {isLoading ?
                                <div className="flex justify-center items-center h-screen">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></div>
                                </div> :
                            <div className="grid grid-cols-1 gap-2">
                            {sortedProducts && sortedProducts.map((product: any, i: number) => (    
                                <div key={i} className="w-full flex flex-row p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                    <div className="basis-1/4">
                                        <div>
                                            <img width={300} className="p-8 rounded-t-lg" src={product.image} alt="product image" />
                                        </div>
                                        <div onClick={() => handleComparedProducts(product)} className="flex items-center mb-4 cursor-pointer hover:opacity-60">
                                            {!comparedProducts.includes(product) ?
                                            <>
                                                <label htmlFor="default-checkbox" className="ml-2 text-lg cursor-pointer font-bold text-gray-900 dark:text-gray-300">مقارنة</label>
                                                <svg fill="#000000" width="27" height="27" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M16 0c-8.836 0-16 7.163-16 16s7.163 16 16 16c8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 30.032c-7.72 0-14-6.312-14-14.032s6.28-14 14-14 14 6.28 14 14-6.28 14.032-14 14.032zM23 15h-6v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v6h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1h6v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6h6c0.552 0 1-0.448 1-1s-0.448-1-1-1z" />
                                                </svg>
                                            </>
                                            : 
                                            <>
                                                <label htmlFor="default-checkbox" className="ml-2 text-lg cursor-pointer font-bold text-gray-900 dark:text-gray-300">ازل من المقارنة</label>
                                                <svg className='rotate-45' fill="#000000" width="27" height="27" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M16 0c-8.836 0-16 7.163-16 16s7.163 16 16 16c8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 30.032c-7.72 0-14-6.312-14-14.032s6.28-14 14-14 14 6.28 14 14-6.28 14.032-14 14.032zM23 15h-6v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v6h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1h6v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6h6c0.552 0 1-0.448 1-1s-0.448-1-1-1z" />
                                                </svg>
                                            </>
                                            }
                                        </div>
                                    </div>
                                    <div className="px-5 py-6 basis-3/4">
                                        <a href="#">
                                            <h5 onClick={() => navigate(`/product/${category}/${product._id}`)} className="text-lg font-normal tracking-tight text-gray-900 dark:text-white hover:underline cursor-pointer">{product.title}</h5>
                                        </a>
                                        {product.stars && (
                                            <div className="flex items-center mt-2.5 mb-5">
                                                {/* {[...Array(Math.round(product.stars))].map((_, i) => (
                                                    <svg key={i} aria-hidden="true" className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Second star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                ))} */}
                                                <div className='text-black cursor-pointer font-bold text-sm ml-1'>
                                                    {product.stars}
                                                </div>
                                                <div dir='ltr' className='flip'>
                                                    <ReactStars
                                                    count={5}
                                                    value={product.stars}
                                                    size={24}
                                                    edit={false}
                                                    color2={'#ffd700'} />
                                                </div>
                                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">{product.reviews}</span>
                                            </div>
                                        )}               

                                        <div className="flex items-center justify-between">
                                            <span className="text-3xl font-bold text-gray-900 dark:text-white">{product.price}</span>
                                            </div>
                                            <div className="flex  flex-col items-center justify-end">

                                                <a className="text-1xl font-soft text-gray-900 dark:text-white">توصيل مجاني</a> 
                                                <img className='opject-right' src={shipping}> 
                                                </img>
                                            </div>
                                        <div className="flex items-center justify-center ml-40 mt-10">
                                        <a onClick={() => navigate(`/product/${category}/${product._id}`)} className="text-black cursor-pointer bg-white shadow-2xl hover:text-gray-500 hover:bg-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center justify-content: center">المزيد عن المنتج</a> 
                                        </div>
                                    </div>
                                </div>
                            ))}
                            </div>
                            }
                        </div>
                    </div>
                </section>
                </main>
            </div>
            { comparedProducts.length > 0 &&
                <div className="fixed bottom-0 border-t-2 border-t-gray-300 left-0 right-0 z-40 w-full p-5 overflow-y-auto transition-transform bg-gray-100 dark:bg-gray-800 transform-none" tabIndex={-1} aria-labelledby="drawer-bottom-label">
                    <div className='flex gap-3'>
                        <button onClick={() => setComparedProducts([])} data-drawer-hide="drawer-bottom-example" aria-controls="drawer-bottom-example" className="text-gray-400 w-[30px] h-[30px] bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                            <svg aria-hidden="true" className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            <span className="sr-only">Close menu</span>
                        </button>
                        <h5 id="drawer-bottom-label" className="items-center mt-1 mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">قارن المنتجات</h5>
                    </div>
                    <div className="flex gap-4 p-6 justify-center justify-items-center">
                        { comparedProducts.map((product, index) =>
                            <div key={index} className=" bg-white border w-[300px] border-gray-200 rounded-lg focus:outline-none hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                <img className="p-8 rounded-t-lg w-100%" src={product.image} alt="product image" />
                                <h5 className='font-semibold text-gray-400 p-4'>{product.title.substring(0, 50) + '...'}</h5>
                            </div>
                        )}
                        { placesholder }
                    </div>
                    <div className="flex justify-center items-center">
                        <a href="#" className="inline-flex items-center px-10 py-3 text-xl font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">قارن</a>
                    </div>
                </div>
            }
            {/* <div>
                <div id="defaultModal" tabIndex={-1} aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 bg-gray-900/50 backdrop-blur-sm overflow-x-hidden overflow-y-auto md:inset-0 h-[100% ,./] max-h-full">
                    <div className="flex flex-col items-center">
                    <div className="relative max-w-5xl bg-gray-100 rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Terms of Service
                        </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        </div>
                        <div className="p-6 space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
                        </p>
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
                        </p>
                        </div>
                        <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button data-modal-hide="defaultModal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
                        <button data-modal-hide="defaultModal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Decline</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div> */}



        </div>
    )
}

export default Category
