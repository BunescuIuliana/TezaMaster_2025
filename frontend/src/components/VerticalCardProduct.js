import React, { useContext, useEffect, useState } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayMDLCurrency from '../helpers/displayCurrency';
import { Link } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import { useTranslation } from 'react-i18next';

const VerticalCardProduct = ({ category, heading }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { fetchUserAddToCart } = useContext(Context);
    const { t } = useTranslation();

    const handleAddToCart = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [category]);

    return (
        <div className='container mx-auto px-4 my-8'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>{heading}</h2>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {loading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className='bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full'>
                            <div className='bg-gray-100 h-60 animate-pulse'></div>
                            <div className='p-4 space-y-3 flex flex-col flex-grow'>
                                <div className='h-5 bg-gray-200 rounded animate-pulse'></div>
                                <div className='h-4 bg-gray-200 rounded animate-pulse'></div>
                                <div className='flex justify-between mt-auto'>
                                    <div className='h-5 w-20 bg-gray-200 rounded animate-pulse'></div>
                                    <div className='h-5 w-16 bg-gray-200 rounded animate-pulse'></div>
                                </div>
                                <div className='h-9 bg-gray-200 rounded-full animate-pulse mt-3'></div>
                            </div>
                        </div>
                    ))
                ) : (
                    data.map((product) => (
                        <div key={product._id} className='flex flex-col h-full group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
                            <Link 
                                to={`/product/${product._id}`}
                                className='flex flex-col h-full'
                            >
                                <div className='bg-gray-50 h-60 p-4 flex items-center justify-center'>
                                    <img 
                                        src={product.productImage[0]} 
                                        alt={product.productName}
                                        className='object-contain h-full w-full transition-transform duration-300 group-hover:scale-105'
                                        loading='lazy'
                                    />
                                </div>
                                <div className='p-4 flex flex-col flex-grow'>
                                    <h3 className='font-semibold text-lg text-gray-800 line-clamp-2'>
                                        {product.productName}
                                    </h3>
                                    <p className='text-gray-500 capitalize mb-2'>{product.category}</p>
                                    <div className='flex items-center justify-between mt-auto'>
                                        <span className='text-xl font-bold text-blue-600'>
                                            {displayMDLCurrency(product.sellingPrice)}
                                        </span>
                                        {product.price > product.sellingPrice && (
                                            <span className='text-sm text-gray-400 line-through'>
                                                {displayMDLCurrency(product.price)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                            <div className='p-4 pt-0'>
                                <button 
                                    className='w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-300'
                                    onClick={(e) => handleAddToCart(e, product._id)}
                                >
                                    {t('product.addToCart')}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default VerticalCardProduct;