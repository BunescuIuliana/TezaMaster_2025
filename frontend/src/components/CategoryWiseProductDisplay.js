import React, { useContext, useEffect, useState } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayMDLCurrency from '../helpers/displayCurrency';
import { Link } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import scrollTop from '../helpers/scrollTop';
import { useTranslation } from 'react-i18next';

const CategoryWiseProductDisplay = ({ category, heading }) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(4).fill(null);
  const { fetchUserAddToCart } = useContext(Context);

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const categoryProduct = await fetchCategoryWiseProduct(category);
      setData(categoryProduct?.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  return (
    <div className='container mx-auto px-4'>
      {/* Large invisible top bar */}
      <div className='h-20'></div>

      {/* Category Header */}
      <h2 className='text-2xl md:text-3xl font-bold text-gray-800 mb-6'>{t(heading)}</h2>

      {/* Products Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8'>
        {loading ? (
          loadingList.map((_, index) => (
            <div key={index} className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col'>
              <div className='bg-gray-100 h-56 flex justify-center items-center animate-pulse'>
                <div className='w-full h-full'></div>
              </div>
              <div className='p-4 flex-grow flex flex-col'>
                <div className='h-6 bg-gray-200 rounded animate-pulse mb-2'></div>
                <div className='h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-4'></div>
                <div className='flex justify-between mt-auto'>
                  <div className='h-5 w-20 bg-gray-200 rounded animate-pulse'></div>
                  <div className='h-5 w-16 bg-gray-200 rounded animate-pulse'></div>
                </div>
                <div className='h-10 bg-gray-200 rounded-full animate-pulse mt-3'></div>
              </div>
            </div>
          ))
        ) : (
          data.map((product) => (
            <div key={product._id} className='flex flex-col h-full'>
              <Link 
                to={`/product/${product?._id}`}
                className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full'
                onClick={scrollTop}
              >
                {/* Product Image with fixed height */}
                <div className='bg-gray-100 h-56 p-4 flex justify-center items-center'>
                  <img 
                    src={product.productImage[0]} 
                    alt={product.productName}
                    className='object-contain h-full w-full transition-transform duration-300 hover:scale-105'
                    onError={(e) => {
                      e.target.src = '/placeholder-product.png';
                    }}
                  />
                </div>

                {/* Product Info with consistent spacing */}
                <div className='p-4 flex flex-col flex-grow'>
                  <h3 className='font-semibold text-lg text-gray-800 line-clamp-2 min-h-[3rem]'>
                    {product?.productName}
                  </h3>
                  <p className='text-gray-500 capitalize mt-1 mb-2'>
                    {t(`categories.${product?.category.toLowerCase()}`)}
                  </p>
                  
                  {/* Price Section with MDL currency */}
                  <div className='mt-auto'>
                    <div className='flex items-center justify-between mb-3'>
                      <span className='text-xl font-bold text-blue-600'>
                        {displayMDLCurrency(product?.sellingPrice)}
                      </span>
                      {product?.price > product?.sellingPrice && (
                        <span className='text-sm text-gray-400 line-through'>
                          {displayMDLCurrency(product?.price)}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                      className='w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-300'
                      onClick={(e) => handleAddToCart(e, product._id)}
                    >
                      {t('product.addToCart')}
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;