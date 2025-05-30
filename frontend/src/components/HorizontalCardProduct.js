import React, { useContext, useEffect, useState } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayMDLCurrency from '../helpers/displayCurrency';
import { Link } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import { useTranslation } from 'react-i18next';

const HorizontalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(4).fill(null);

  const { fetchUserAddToCart } = useContext(Context);
  const { t } = useTranslation();

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
    <div className="container mx-auto px-4 my-6">
      {/* Invisible top bar */}
      <div className="h-16"></div>
      
      <h2 className="text-2xl font-semibold py-4">{t(heading)}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading
          ? loadingList.map((product, index) => (
              <div
                key={index}
                className="w-full h-36 bg-white rounded-lg shadow flex border border-gray-100"
              >
                <div className="bg-gray-100 h-full p-4 min-w-[120px] animate-pulse"></div>
                <div className="p-4 grid w-full gap-2">
                  <h2 className="font-medium text-base text-ellipsis line-clamp-1 text-black bg-gray-200 animate-pulse p-1 rounded-full"></h2>
                  <p className="capitalize text-gray-500 p-1 bg-gray-200 animate-pulse rounded-full"></p>
                  <div className="flex gap-3 w-full">
                    <p className="text-blue-600 font-medium p-1 bg-gray-200 w-full animate-pulse rounded-full"></p>
                    <p className="text-gray-400 line-through p-1 bg-gray-200 w-full animate-pulse rounded-full"></p>
                  </div>
                  <button className="text-sm text-white px-3 py-1.5 rounded-full w-full bg-gray-200 animate-pulse"></button>
                </div>
              </div>
            ))
          : data.map((product) => (
              <Link
                to={'/product/' + product?._id}
                key={product._id}
                className="w-full h-36 bg-white rounded-lg shadow flex hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                <div className="bg-gray-100 h-full p-4 min-w-[120px] flex items-center">
                  <img
                    src={product.productImage[0]}
                    className="object-contain h-full hover:scale-110 transition-transform duration-300"
                    alt={product.productName}
                    onError={(e) => {
                      e.target.src = '/placeholder-product.png';
                    }}
                  />
                </div>
                <div className="p-4 grid flex-grow">
                  <h2 className="font-medium text-base text-ellipsis line-clamp-1 text-black">
                    {product?.productName}
                  </h2>
                  <p className="capitalize text-gray-500 text-sm">
                    {t(`categories.${product?.category.toLowerCase()}`)}
                  </p>
                  <div className="flex gap-3 items-center">
                    <p className="text-blue-600 font-medium">
                      {displayMDLCurrency(product?.sellingPrice)}
                    </p>
                    {product?.price > product?.sellingPrice && (
                      <p className="text-gray-400 line-through text-sm">
                        {displayMDLCurrency(product?.price)}
                      </p>
                    )}
                  </div>
                  <button
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full transition-colors duration-300 mt-auto"
                    onClick={(e) => handleAddToCart(e, product?._id)}
                  >
                    {t('product.addToCart')}
                  </button>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default HorizontalCardProduct;