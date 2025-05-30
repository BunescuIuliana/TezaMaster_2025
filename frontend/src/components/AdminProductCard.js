import React, { useState } from 'react';
import { MdModeEditOutline } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import { useTranslation } from 'react-i18next';

const displayMDLCurrency = (num) => {
    if (isNaN(num)) {
        console.error("Invalid number provided to displayMDLCurrency:", num);
        return "0,00 MDL";
    }

    const number = Number(num);
    const decimalPlaces = (number.toString().split('.')[1] || []).length;
    const needsThreeDecimals = decimalPlaces > 2 && number % 0.01 !== 0;
    
    const options = {
        style: "currency",
        currency: 'MDL',
        minimumFractionDigits: 2,
        maximumFractionDigits: needsThreeDecimals ? 3 : 2
    };

    const processedNum = needsThreeDecimals ? number : Math.round(number * 100) / 100;
    
    try {
        return new Intl.NumberFormat('ro-MD', options).format(processedNum);
    } catch (error) {
        console.error("Currency formatting failed:", error);
        return needsThreeDecimals 
            ? `${processedNum.toFixed(3)} MDL` 
            : `${processedNum.toFixed(2)} MDL`;
    }
};

const AdminProductCard = ({ data, fetchdata }) => {
    const { t } = useTranslation();
    const [editProduct, setEditProduct] = useState(false);

    return (
        <div className='bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow duration-300'>
            <div className='w-40'>
                {/* Product Image with Error Handling */}
                <div className='w-32 h-32 flex justify-center items-center mx-auto mb-3 bg-gray-50'>
                    {data?.productImage?.[0] ? (
                        <img 
                            src={data.productImage[0]}  
                            className='mx-auto object-contain h-full'
                            alt={data.productName || "Product image"}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/placeholder-product.png';
                            }}
                        />
                    ) : (
                        <div className="text-gray-400 text-sm">No Image</div>
                    )}
                </div>
                
                {/* Product Name */}
                <h1 className='text-ellipsis line-clamp-2 text-gray-800 font-medium mb-2 h-12'>
                    {data?.productName || t("product.unnamed")}
                </h1>

                <div className='flex items-center justify-between'>
                    {/* Price Display */}
                    <p className='font-semibold text-blue-600'>
                        {data?.sellingPrice !== undefined 
                            ? displayMDLCurrency(data.sellingPrice)
                            : t("product.priceNotAvailable")}
                    </p>

                    {/* Edit Button */}
                    <div 
                        className='w-fit ml-auto p-2 bg-blue-100 hover:bg-blue-600 rounded-full hover:text-white cursor-pointer transition-colors duration-300'
                        onClick={() => setEditProduct(true)}
                        title={t("adminProductCard.editButtonAlt")}
                        aria-label={t("adminProductCard.editButtonAlt")}
                    >
                        <MdModeEditOutline className='text-blue-800 hover:text-white'/>
                    </div>
                </div>
            </div>
            
            {/* Edit Product Modal */}
            {editProduct && (
                <AdminEditProduct 
                    productData={data} 
                    onClose={() => setEditProduct(false)} 
                    fetchdata={fetchdata}
                />
            )}
        </div>
    );
};

export default AdminProductCard;