import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaStar, FaStarHalf, FaShoppingCart, FaBolt, FaChevronLeft } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import displayMdlCurrency from '../helpers/displayCurrency';
import CategroyWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import addToCart from '../helpers/addToCart';
import Context from '../context';

const ProductDetails = () => {
    const [data, setData] = useState({
        productName: "",
        brandName: "",
        category: "",
        productImage: [],
        description: "",
        price: "",
        sellingPrice: ""
    });
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState("");
    const [zoomImageCoordinate, setZoomImageCoordinate] = useState({ x: 0, y: 0 });
    const [zoomImage, setZoomImage] = useState(false);
    const { fetchUserAddToCart } = useContext(Context);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const fetchProductDetails = async () => {
        setLoading(true);
        const response = await fetch(SummaryApi.productDetails.url, {
            method: SummaryApi.productDetails.method,
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                productId: params?.id
            })
        });
        setLoading(false);
        const dataResponse = await response.json();
        setData(dataResponse?.data);
        setActiveImage(dataResponse?.data?.productImage[0]);
    };

    useEffect(() => {
        fetchProductDetails();
    }, [params]);

    const handleMouseEnterProduct = (imageURL) => {
        setActiveImage(imageURL);
    };

    const handleZoomImage = useCallback((e) => {
        setZoomImage(true);
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        setZoomImageCoordinate({ x, y });
    }, []);

    const handleLeaveImageZoom = () => {
        setZoomImage(false);
    };

    const handleAddToCart = async (e, id) => {
        await addToCart(e, id);
        fetchUserAddToCart();
        toast.success(t('product.added_to_cart'));
    };

    const handleBuyProduct = async (e, id) => {
        await addToCart(e, id);
        fetchUserAddToCart();
        navigate("/cart");
    };

    return (
        <div className='relative w-full min-h-screen bg-gray-50'>
            {/* Back button */}
            <button 
                onClick={() => navigate(-1)}
                className="fixed top-4 left-4 z-20 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-all"
                aria-label={t('product.back_button')}
            >
                <FaChevronLeft className="text-gray-700" />
            </button>

            <div className='container mx-auto p-4 pt-20 max-w-7xl'>
                <div className='min-h-[200px] flex flex-col lg:flex-row gap-8 mb-8'>
                    {/*** Product Image Section */}
                    <div className='h-96 flex flex-col lg:flex-row-reverse gap-4'>
                        <div className='h-[350px] w-[350px] lg:h-[450px] lg:w-[450px] bg-white relative p-4 rounded-xl shadow-sm border border-gray-200'>
                            <img
                                src={activeImage}
                                className='h-full w-full object-scale-down mix-blend-multiply cursor-zoom-in transition-transform duration-200 hover:scale-105'
                                onMouseMove={handleZoomImage}
                                onMouseLeave={handleLeaveImageZoom}
                                alt={data?.productName || t('product.product_image')}
                            />

                            {/** Zoom Image Preview */}
                            {zoomImage && (
                                <div className='hidden lg:block absolute min-w-[600px] overflow-hidden min-h-[500px] bg-white p-2 -right-[610px] top-0 rounded-xl shadow-lg border border-gray-200'>
                                    <div
                                        className='w-full h-full min-h-[500px] min-w-[600px] mix-blend-multiply scale-150'
                                        style={{
                                            background: `url(${activeImage})`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`
                                        }}
                                    ></div>
                                </div>
                            )}
                        </div>

                        {/*** Thumbnail Images */}
                        <div className='h-full max-h-[450px] overflow-y-auto pr-2 custom-scroll'>
                            {loading ? (
                                <div className='flex gap-3 lg:flex-col'>
                                    {[...Array(4)].map((_, index) => (
                                        <div className='h-24 w-24 bg-gray-200 rounded-lg animate-pulse' key={"loadingImage" + index}></div>
                                    ))}
                                </div>
                            ) : (
                                <div className='flex gap-3 lg:flex-col'>
                                    {data?.productImage?.map((imgURL, index) => (
                                        <div 
                                            className={`h-24 w-24 bg-white rounded-lg p-2 cursor-pointer transition-all border-2 ${activeImage === imgURL ? 'border-blue-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`} 
                                            key={imgURL}
                                        >
                                            <img
                                                src={imgURL}
                                                className='w-full h-full object-scale-down mix-blend-multiply transition-transform duration-200 hover:scale-110'
                                                onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                                                onClick={() => handleMouseEnterProduct(imgURL)}
                                                alt={`${t('product.product')} ${index + 1}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/*** Product Details Section */}
                    {loading ? (
                        <div className='grid gap-3 w-full'>
                            <p className='bg-gray-200 animate-pulse h-6 lg:h-8 w-24 rounded-full'></p>
                            <h2 className='text-2xl lg:text-4xl font-medium h-8 lg:h-10 bg-gray-200 animate-pulse w-full rounded-lg'></h2>
                            <p className='capitalize text-slate-400 bg-gray-200 min-w-[100px] animate-pulse h-6 lg:h-8 w-32 rounded-lg'></p>
                            <div className='text-red-600 bg-gray-200 h-6 lg:h-8 animate-pulse flex items-center gap-1 w-40 rounded-lg'></div>
                            <div className='flex items-center gap-4 text-2xl lg:text-3xl font-medium my-1 h-8 lg:h-10 animate-pulse w-full'>
                                <p className='text-red-600 bg-gray-200 w-32 rounded-lg'></p>
                                <p className='text-slate-400 line-through bg-gray-200 w-32 rounded-lg'></p>
                            </div>
                            <div className='flex items-center gap-4 my-2 w-full'>
                                <button className='h-12 lg:h-14 bg-gray-200 rounded-xl animate-pulse w-36'></button>
                                <button className='h-12 lg:h-14 bg-gray-200 rounded-xl animate-pulse w-48'></button>
                            </div>
                            <div className='w-full'>
                                <p className='text-slate-600 font-medium my-1 h-6 lg:h-8 bg-gray-200 rounded-lg animate-pulse w-32'></p>
                                <p className='bg-gray-200 rounded-lg animate-pulse h-40 lg:h-48 w-full'></p>
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col gap-3 w-full'>
                            <p className='bg-blue-100 text-blue-800 px-4 py-2 rounded-full inline-block w-fit text-sm font-medium shadow-sm'>
                                {data?.brandName}
                            </p>
                            <h2 className='text-3xl lg:text-4xl font-bold text-gray-900'>{data?.productName}</h2>
                            <p className='capitalize text-gray-500 font-medium'>{data?.category}</p>
                            <div className='flex items-center gap-1'>
                                <div className='text-yellow-400 flex'>
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStarHalf />
                                </div>
                                <span className='text-gray-500 text-sm ml-1'>(24 {t('product.reviews')})</span>
                                <span className='text-blue-500 text-sm ml-2 font-medium cursor-pointer hover:underline'>
                                    {t('product.write_review')}
                                </span>
                            </div>
                            
                            {/* Price Display */}
                            <div className='flex items-center gap-4 my-4'>
                                <p className='text-blue-600 font-bold text-3xl lg:text-4xl'>
                                    {displayMdlCurrency(data.sellingPrice)}
                                </p>
                                {data.price !== data.sellingPrice && (
                                    <div className='flex flex-col'>
                                        <p className='text-gray-400 line-through text-xl'>
                                            {displayMdlCurrency(data.price)}
                                        </p>
                                        <p className='text-green-600 font-medium text-sm'>
                                            {Math.round((1 - data.sellingPrice/data.price) * 100)}% {t('product.discount')}
                                        </p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className='flex items-center gap-4 my-6'>
                                <button
                                    className='flex items-center justify-center gap-2 bg-white text-blue-600 rounded-full px-8 py-3 font-bold border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all hover:shadow-md active:scale-95'
                                    onClick={(e) => handleBuyProduct(e, data?._id)}
                                >
                                    <FaBolt />
                                    {t('product.buy_now')}
                                </button>
                                <button
                                    className='flex items-center justify-center gap-2 bg-white text-blue-600 rounded-full px-8 py-3 font-bold border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all hover:shadow-md active:scale-95'
                                    onClick={(e) => handleAddToCart(e, data?._id)}
                                >
                                    <FaShoppingCart />
                                    {t('product.add_to_cart')}
                                </button>
                            </div>
                            
                            {/* Product Description */}
                            <div className='mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
                                <p className='text-gray-800 font-semibold text-lg mb-3'>{t('product.description')}</p>
                                <p className='text-gray-600 leading-relaxed'>{data?.description}</p>
                            </div>
                            
                            {/* Product Highlights */}
                            <div className='mt-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
                                <p className='text-gray-800 font-semibold text-lg mb-3'>{t('product.highlights')}</p>
                                <ul className='text-gray-600 space-y-2'>
                                    <li className='flex items-start'>
                                        <span className='text-blue-500 mr-2'>•</span>
                                        {t('product.high_quality_materials')}
                                    </li>
                                    <li className='flex items-start'>
                                        <span className='text-blue-500 mr-2'>•</span>
                                        {t('product.warranty_available')}
                                    </li>
                                    <li className='flex items-start'>
                                        <span className='text-blue-500 mr-2'>•</span>
                                        {t('product.free_shipping')}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/*** Recommended Products Section */}
                {data.category && (
                    <div className='mt-12 mb-16'>
                        <CategroyWiseProductDisplay 
                            category={data?.category} 
                            heading={t('product.recommended_products')} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;