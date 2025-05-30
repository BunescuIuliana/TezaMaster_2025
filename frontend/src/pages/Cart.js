import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { MdDelete, MdShoppingCart } from "react-icons/md";
import { FaShoppingBag, FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import Context from '../context';
import displayMDLCurrency from '../helpers/displayCurrency';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const context = useContext(Context);
    const { t } = useTranslation();
    const user = useSelector((state) => state?.user?.user);
    const navigate = useNavigate();
    const loadingSkeleton = new Array(4).fill(null);

    const fetchCartData = async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.addToCartProductView.url, {
                method: SummaryApi.addToCartProductView.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
            });
            
            const responseData = await response.json();
            
            if(responseData.success) {
                setCartItems(responseData.data.filter(item => item?.productId !== null));
            }
        } catch (error) {
            toast.error(t('cart.fetchError'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    const updateQuantity = async (id, newQuantity) => {
        try {
            if(newQuantity < 1) {
                await removeFromCart(id);
                return;
            }
            
            const response = await fetch(SummaryApi.updateCartProduct.url, {
                method: SummaryApi.updateCartProduct.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify({
                    _id: id,
                    quantity: newQuantity
                })
            });

            const responseData = await response.json();

            if(responseData.success) {
                fetchCartData();
                context.fetchUserAddToCart();
                toast.success(t('cart.quantityUpdated'));
            }
        } catch (error) {
            toast.error(t('cart.updateError'));
        }
    };

    const removeFromCart = async (id) => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.deleteCartProduct.url, {
                method: SummaryApi.deleteCartProduct.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify({
                    _id: id,
                })
            });

            const responseData = await response.json();

            if(responseData.success) {
                setCartItems(prev => prev.filter(item => item._id !== id));
                context.fetchUserAddToCart();
                toast.success(t('cart.productRemoved'));
            }
        } catch (error) {
            toast.error(t('cart.deleteError'));
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async () => {
        if(cartItems.length === 0) {
            toast.warning(t('cart.emptyCartAlert'), {
                icon: <MdShoppingCart className="text-yellow-500" />,
                autoClose: 3000
            });
            return;
        }

        if(!user?._id) {
            toast.warning(t('cart.loginRequired'), {
                icon: <FaArrowRight className="text-yellow-500" />,
                autoClose: 3000,
                onClose: () => navigate('/login')
            });
            return;
        }

        setCheckoutLoading(true);
        
        // Save cart items for payment page
        const checkoutItems = [...cartItems];
        
        // Clear cart immediately
        setCartItems([]);
        context.fetchUserAddToCart();
        
        // Attempt to clear server cart (fire and forget)
        fetch(SummaryApi.clearCart.url, {
            method: SummaryApi.clearCart.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            }
        }).catch(error => console.error("Error clearing server cart:", error));
        
        // Navigate to payment page with items
        navigate('/payment', { state: { cartItems: checkoutItems } });
        
        setCheckoutLoading(false);
    };

    const totalQuantity = cartItems.reduce((sum, item) => sum + (item?.quantity || 0), 0);
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + ((item?.quantity || 0) * (item?.productId?.sellingPrice || 0)), 
        0
    );

    return (
        <div className='container mx-auto px-4 py-8 min-h-[calc(100vh-120px)]'>
            <div className='flex flex-col lg:flex-row gap-8'>
                {/* Product List Section */}
                <div className='lg:w-2/3'>
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h1 className='text-2xl font-bold text-gray-800'>
                            {t('cart.yourCart')} 
                            <span className="text-blue-600"> ({cartItems.length} {t('cart.items')})</span>
                        </h1>
                    </div>
                    
                    {/* Empty State */}
                    {cartItems.length === 0 && !loading && (
                        <div className='bg-white p-8 rounded-lg shadow-md text-center flex flex-col items-center'>
                            <FaShoppingBag className='text-5xl text-gray-300 mb-4' />
                            <h2 className='text-xl font-semibold mb-2 text-gray-700'>{t('cart.emptyCart')}</h2>
                            <p className='text-gray-500 mb-4'>{t('cart.addProductsPrompt')}</p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading ? (
                        <div className='space-y-4'>
                            {loadingSkeleton.map((_, index) => (
                                <div 
                                    key={`loading-${index}`} 
                                    className='w-full bg-gray-100 h-32 my-2 border border-gray-200 animate-pulse rounded-lg'
                                />
                            ))}
                        </div>
                    ) : (
                        /* Cart Products List */
                        <div className='space-y-4'>
                            {cartItems.map((product) => (
                                <div 
                                    key={product?._id} 
                                    className='w-full bg-white my-2 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-[120px,1fr]'
                                >
                                    {/* Product Image */}
                                    <div className='w-full h-full bg-gray-100 flex items-center justify-center p-2'>
                                        <img 
                                            src={product?.productId?.productImage?.[0] || '/placeholder-product.png'} 
                                            alt={product?.productId?.productName || 'Product image'}
                                            className='w-full h-32 object-contain'
                                            onError={(e) => {
                                                e.target.onerror = null; 
                                                e.target.src = '/placeholder-product.png';
                                            }}
                                        />
                                    </div>
                                    
                                    {/* Product Details */}
                                    <div className='p-4 relative'>
                                        <div className='flex justify-between items-start'>
                                            <div>
                                                <h3 className='font-medium text-gray-800 line-clamp-2'>
                                                    {product?.productId?.productName || 'Unnamed Product'}
                                                </h3>
                                            </div>
                                            {/* Delete Button */}
                                            <button 
                                                onClick={() => !loading && removeFromCart(product?._id)}
                                                disabled={loading}
                                                className={`text-gray-400 hover:text-red-500 transition-colors p-1 ${
                                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                                aria-label={t('cart.removeItem')}
                                            >
                                                <MdDelete className='text-xl' />
                                            </button>
                                        </div>
                                        
                                        {/* Product Price */}
                                        <p className='text-blue-600 font-semibold mt-2 text-lg'>
                                            {displayMDLCurrency(product?.productId?.sellingPrice || 0)}
                                        </p>
                                        
                                        {/* Quantity Controls */}
                                        <div className='mt-4 flex items-center justify-between'>
                                            <div className='flex items-center gap-3'>
                                                <button 
                                                    onClick={() => updateQuantity(product?._id, product?.quantity - 1)}
                                                    disabled={loading}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-all ${
                                                        loading ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                    aria-label={t('cart.decreaseQuantity')}
                                                >
                                                    -
                                                </button>
                                                <span className='font-medium w-8 text-center'>{product?.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(product?._id, product?.quantity + 1)}
                                                    disabled={loading}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-all ${
                                                        loading ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                    aria-label={t('cart.increaseQuantity')}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            {/* Subtotal */}
                                            <p className='text-gray-600 font-medium'>
                                                {t('cart.subtotal')}: {displayMDLCurrency(
                                                    (product?.quantity || 0) * (product?.productId?.sellingPrice || 0)
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Order Summary Section */}
                <div className='lg:w-1/3'>
                    <div className='bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden sticky top-4'>
                        <h2 className='text-white bg-blue-600 px-4 py-3 text-lg font-semibold flex items-center gap-2'>
                            <FaShoppingBag />
                            {t('cart.cartSummary')}
                        </h2>
                        <div className='p-4 space-y-4'>
                            <div className='flex items-center justify-between'>
                                <p className='text-gray-600'>{t('cart.products')}</p>
                                <p className='font-medium'>{cartItems.length}</p>
                            </div>
                            
                            <div className='flex items-center justify-between'>
                                <p className='text-gray-600'>{t('cart.totalQuantity')}</p>
                                <p className='font-medium'>{totalQuantity}</p>
                            </div>

                            <div className='border-t border-gray-200 pt-3 flex items-center justify-between'>
                                <p className='text-gray-600 font-medium'>{t('cart.totalToPay')}</p>
                                <p className='text-blue-600 font-semibold text-xl'>
                                    {displayMDLCurrency(totalPrice)}
                                </p>
                            </div>

                            {/* Checkout Button */}
                            <button 
                                onClick={handleCheckout}
                                disabled={cartItems.length === 0 || checkoutLoading}
                                className={`w-full flex items-center justify-center gap-2 ${
                                    cartItems.length === 0 || checkoutLoading
                                    ? 'bg-gray-300 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                                } text-white py-3 rounded-lg font-medium transition-all duration-300 shadow-md`}
                            >
                                {checkoutLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t('cart.processing')}
                                    </span>
                                ) : (
                                    <>
                                        {t('cart.proceedToPayment')}
                                        <FaArrowRight />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;