import React, {useContext} from 'react'
import ProductContext from '../context/ProductContext'

const ProductDetails = () => {
  
  const { quantity, quantityCount, productTitleRef, productPriceRef, productQuantityRef, addCart, productData } = useContext(ProductContext)
  console.log(productData)
  return (
    <>
    {productData ?
    (<>
    <h2 className="company uppercase font-extrabold text-sm sm:text-md tracking-wider pb-3 sm:pb-5">
      {productData[0].details['العلامة التجارية']}
    </h2>
    <h3 ref={productTitleRef} className="product capitalize text-very-dark-blue font-normal text-3xl sm:text-4xl sm:leading-none pb-3">
      {productData[0].title}
    </h3>
    <p className="text-dark-grayish-blue pb-6 lg:py-7 lg:leading-6">
      {Object.keys(productData[0].details).map((key, index) => {
        return (
          <div key={index}>
            <span  className="font-medium text-black">{key}:</span>
            <span className="text-gray-500 font-normal"> {productData[0].details[key]}</span>
          </div>
        )})
      }
    </p>
    <div className="amount font-bold flex items-center justify-between lg:flex-col lg:items-start mb-6">
      <div className="discount-price items-center flex">
        <div ref={productPriceRef} className="price text-3xl">{productData[0].price}</div>
        {/* <div className="discount text-orange bg-pale-orange w-max px-2 rounded mx-5 h-6">
          50%
        </div> */}
      </div>
      {/* <div className="original-price text-grayish-blue line-through lg:mt-2">
        {productData[0].price}
      </div> */}
    </div>
    <div className="sm:flex lg:mt-8 w-full">
      {/* <div className="quantity-container w-full bg-light-grayish-blue rounded-lg h-14 mb-4 flex items-center justify-between px-6 lg:px-3 font-bold sm:mr-3 lg:mr-5 lg:w-1/3">
        <button onClick={quantity} className="text-orange text-2xl leading-none font-bold mb-1 lg:mb-2 lg:text-3xl hover:opacity-60">-</button>
        <input ref={productQuantityRef} min={0} max={100} onChange={quantity} className="quantity focus:outline-none text-dark-blue bg-light-grayish-blue font-bold flex text-center w-full" type="number" name="quantity" value={quantityCount} aria-label="quantity number" />
        <button onClick={quantity} className="text-orange text-2xl leading-none font-bold mb-1 lg:mb-2 lg:text-3xl hover:opacity-60">+</button>
      </div> */}

      <button onClick={() => open(productData[0].link)} className="cart w-full h-14 bg-orange-500 bg rounded-lg lg:rounded-xl mb-2 shadow-orange-shadow shadow-2xl text-white flex items-center justify-center lg:w-3/5 hover:opacity-60">
        <i className='cursor-pointer text-black text-xl leading-0 pr-3'>
          <ion-icon name='cart-outline'></ion-icon>
        </i>
        أشتري من أمازون
      </button>
    </div>
    </>)
    : <></>}
    </>
  )
}

export default ProductDetails