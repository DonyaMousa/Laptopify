import { FC } from "react"

const FourOFour: FC<Record<string, never>> = (() => {
    return (
        <>
            <section className="grid h-screen -mt-[61px] place-items-center">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                    <div className="mx-auto max-w-screen-sm text-center">
                        <h1 className="mb-4 text-2xl font-extrabold text-primary-600 text-transparent bg-clip-text bg-gradient-to-r to-volta-warm from-volta-cool">404 Not Found</h1>
                        <p className="mb-10 text-3xl tracking-tight font-bold text-volta-gray-900 md:text-4xl dark:text-white">هذه الصفحه غير موجودة</p>
                        {/* <p className="mb-4 text-volta-gray-500 dark:text-volta-gray-400">Here are some helpful links instead:</p> */}
                        <ul className="flex justify-center items-center space-x-4 text-volta-gray-500 dark:text-volta-gray-400">
                            <li>
                                <a href="/" className="underline hover:text-volta-gray-900 dark:hover:text-white">الصفحه الرئيسية</a>
                            </li>
                            {/* <li>
                                <a href="/wrapping" className="underline hover:text-volta-gray-900 dark:hover:text-white">Wrapping</a>
                            </li> */}
                        </ul>
                    </div>   
                </div>
            </section>
        </>
    )
})

export default FourOFour