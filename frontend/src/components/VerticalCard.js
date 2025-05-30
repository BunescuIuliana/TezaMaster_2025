import React, { useContext } from 'react';
import scrollTop from '../helpers/scrollTop';
import displayMDLCurrency from '../helpers/displayCurrency';
import Context from '../context';
import addToCart from '../helpers/addToCart';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const VerticalCard = ({ loading, data = [] }) => {
  const { fetchUserAddToCart } = useContext(Context);
  const { t } = useTranslation();

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap justify-between gap-y-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div 
              key={index} 
              className="w-[23%] min-h-[400px] bg-white rounded-sm shadow flex flex-col"
            >
              <div className="bg-slate-200 h-48 p-4 flex justify-center items-center animate-pulse"></div>
              <div className="p-4 flex flex-col flex-grow gap-3">
                <h2 className="font-medium text-base md:text-lg text-black p-1 py-2 animate-pulse rounded-full bg-slate-200"></h2>
                <p className="capitalize text-slate-500 p-1 animate-pulse rounded-full bg-slate-200 py-2"></p>
                <div className="flex gap-3 mt-auto">
                  <p className="text-blue-600 font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full py-2"></p>
                  <p className="text-slate-500 line-through p-1 animate-pulse rounded-full bg-slate-200 w-full py-2"></p>
                </div>
                <button className="text-sm text-white px-3 rounded-full bg-slate-200 py-2 animate-pulse"></button>
              </div>
            </div>
          ))
        ) : (
          data.map((product) => (
            <div 
              key={product._id} 
              className="w-[23%] min-h-[400px] bg-white rounded-sm shadow hover:shadow-md transition-all flex flex-col"
            >
              <Link
                to={`/product/${product._id}`}
                className="flex flex-col flex-grow"
                onClick={scrollTop}
              >
                <div className="bg-slate-200 h-48 p-4 flex justify-center items-center">
                  <img
                    src={product.productImage[0]}
                    alt={product.productName}
                    className="object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow gap-3">
                  <h2 className="font-medium text-base md:text-lg text-black line-clamp-2">
                    {product.productName}
                  </h2>
                  <p className="capitalize text-slate-500">{product.category}</p>
                  <div className="flex gap-3 mt-auto">
                    <p className="text-blue-600 font-medium">
                      {displayMDLCurrency(product.sellingPrice)}
                    </p>
                    {product.price > product.sellingPrice && (
                      <p className="text-slate-500 line-through">
                        {displayMDLCurrency(product.price)}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
              <div className="p-4">
                <button
                  className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-full transition-colors duration-300"
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

export default VerticalCard;
