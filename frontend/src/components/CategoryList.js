import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SummaryApi from "../common";

const CategoryList = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.categoryProduct.url);
      const data = await response.json();
      const mappedCategories = [
        "Smartphones", "Headphones", "Smartwatches", "Laptops", "Monitors", "Computers",
        "TVs", "Refrigerators", "Washing Machines", "Dryers", "Dishwashers",
        "Vacuum Cleaners", "Coffee Machines", "Microwave Ovens", "Cameras",
        "Printers", "Processors", "Speakers", "Earphones", "Mouse"
      ].map((category, index) => ({
        id: index + 1,
        category: category.trim(),
        productImage: []
      }));
      setCategories(mappedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      {loading ? (
        <div className="flex justify-center">
          <p className="text-gray-600">{t("categoryList.loading")}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {/* First row - 6 items */}
          <div className="flex justify-center gap-3 w-full flex-wrap">
            {categories.slice(0, 6).map((item) => (
              <Link
                to={`/product-category?category=${item.category}`}
                key={item.id}
                className="w-1/6 min-w-[120px] max-w-[160px]"
              >
                <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all h-full flex items-center justify-center hover:border-blue-300">
                  <p className="text-center text-gray-800 font-medium text-sm">
                    {t(`categoryList.categories.${item.category}`)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Second row - 6 items */}
          <div className="flex justify-center gap-3 w-full flex-wrap">
            {categories.slice(6, 12).map((item) => (
              <Link
                to={`/product-category?category=${item.category}`}
                key={item.id}
                className="w-1/6 min-w-[120px] max-w-[160px]"
              >
                <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all h-full flex items-center justify-center hover:border-blue-300">
                  <p className="text-center text-gray-800 font-medium text-sm">
                    {t(`categoryList.categories.${item.category}`)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Third row - 5 items */}
          <div className="flex justify-center gap-3 w-full flex-wrap">
            {categories.slice(12, 17).map((item) => (
              <Link
                to={`/product-category?category=${item.category}`}
                key={item.id}
                className="w-1/5 min-w-[120px] max-w-[160px]"
              >
                <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all h-full flex items-center justify-center hover:border-blue-300">
                  <p className="text-center text-gray-800 font-medium text-sm">
                    {t(`categoryList.categories.${item.category}`)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Fourth row - 4 items */}
          <div className="flex justify-center gap-3 w-full flex-wrap">
            {categories.slice(17, 21).map((item) => (
              <Link
                to={`/product-category?category=${item.category}`}
                key={item.id}
                className="w-1/4 min-w-[120px] max-w-[160px]"
              >
                <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all h-full flex items-center justify-center hover:border-blue-300">
                  <p className="text-center text-gray-800 font-medium text-sm">
                    {t(`categoryList.categories.${item.category}`)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;