import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { FC, useEffect, useState, Fragment } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { categories } from '../constants'
import axios from 'axios'
import useSWR from 'swr'

const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
]
// const subCategories = [
//   { name: 'Totes', href: '#' },
//   { name: 'Backpacks', href: '#' },
//   { name: 'Travel Bags', href: '#' },
//   { name: 'Hip Bags', href: '#' },
//   { name: 'Laptop Sleeves', href: '#' },
// ]
// const filters = [
//   {
//     id: 'color',
//     name: 'Size of Item',
//     options: [
//       { value: 'white', label: 'White', checked: false },
//       { value: 'beige', label: 'Beige', checked: false },
//       { value: 'blue', label: 'Blue', checked: true },
//       { value: 'brown', label: 'Brown', checked: false },
//       { value: 'green', label: 'Green', checked: false },
//       { value: 'purple', label: 'Purple', checked: false },
//     ],
//   },
//   {
//     id: 'category',
//     name: 'Category',
//     options: [
//       { value: 'new-arrivals', label: 'New Arrivals', checked: false },
//       { value: 'sale', label: 'Sale', checked: false },
//       { value: 'travel', label: 'Travel', checked: true },
//       { value: 'organization', label: 'Organization', checked: false },
//       { value: 'accessories', label: 'Accessories', checked: false },
//     ],
//   },
//   {
//     id: 'size',
//     name: 'Size',
//     options: [
//       { value: '2l', label: '2L', checked: false },
//       { value: '6l', label: '6L', checked: false },
//       { value: '12l', label: '12L', checked: false },
//       { value: '18l', label: '18L', checked: false },
//       { value: '20l', label: '20L', checked: false },
//       { value: '40l', label: '40L', checked: true },
//     ],
//   },
// ]

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
        } else {
            setFilteredProducts(products)
        }
    }, [selectedFilters])

    return (
        <div className="bg-white">
        <div>
            {/* Mobile filter dialog */}

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-baseline justify-between border-b border-gray-200 py-6">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">{category ? categories[category] : 'Tablebt'}</h1>
                

                <div className="flex items-center">
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                    <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                        ترتيب حسب
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
                    <Menu.Items className="absolute -right-[70px] z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                        {sortOptions.map((option) => (
                            <Menu.Item key={option.name}>
                            {({ active }) => (
                                <a
                                href={option.href}
                                className={classNames(
                                    option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm'
                                )}
                                >
                                {option.name}
                                </a>
                            )}
                            </Menu.Item>
                        ))}
                        </div>
                    </Menu.Items>
                    </Transition>
                </Menu>

                {/* <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                    <span className="sr-only">View grid</span>
                    <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
                </button> */}
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


                        <div className="grid grid-cols-3 gap-2">
                        {filteredProducts && filteredProducts.map((product: any, i: number) => (    
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
                        }
                </div>
                </div>
            </section>
            </main>
        </div>
        </div>
    )
}

export default Category
