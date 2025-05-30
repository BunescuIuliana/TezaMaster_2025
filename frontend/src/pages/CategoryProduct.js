import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import productCategory from '../helpers/productCategory';
import VerticalCard from '../components/VerticalCard';
import SummaryApi from '../common';
import { useTranslation } from 'react-i18next';

const CategoryProduct = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const urlSearch = new URLSearchParams(location.search);
    const urlCategoryListinArray = urlSearch.getAll("category");
    const { t } = useTranslation();

    const urlCategoryListObject = {};
    urlCategoryListinArray.forEach(el => {
        urlCategoryListObject[el] = true;
    });

    const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
    const [filterCategoryList, setFilterCategoryList] = useState([]);
    const [sortBy, setSortBy] = useState("");

    const fetchData = async () => {
        setLoading(true);
        const response = await fetch(SummaryApi.filterProduct.url, {
            method: SummaryApi.filterProduct.method,
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                category: filterCategoryList
            })
        });

        const dataResponse = await response.json();
        let sortedData = dataResponse?.data || [];
        
        if (sortBy === 'asc') {
            sortedData = [...sortedData].sort((a, b) => a.sellingPrice - b.sellingPrice);
        } else if (sortBy === 'dsc') {
            sortedData = [...sortedData].sort((a, b) => b.sellingPrice - a.sellingPrice);
        }
        
        setData(sortedData);
        setLoading(false);
    };

    const handleSelectCategory = (e) => {
        const { value, checked } = e.target;
        setSelectCategory((preve) => ({
            ...preve,
            [value]: checked
        }));
    };

    useEffect(() => {
        fetchData();
    }, [filterCategoryList, sortBy]);

    useEffect(() => {
        const arrayOfCategory = Object.keys(selectCategory)
            .map(categoryKeyName => selectCategory[categoryKeyName] ? categoryKeyName : null)
            .filter(el => el);

        setFilterCategoryList(arrayOfCategory);

        const urlFormat = arrayOfCategory.map((el, index) => (
            index === arrayOfCategory.length - 1 ? `category=${el}` : `category=${el}&&`
        )).join("");

        navigate("/product-category?" + urlFormat);
    }, [selectCategory]);

    const handleOnChangeSortBy = (e) => {
        const { value } = e.target;
        setSortBy(value);
    };

    return (
        <div className='container mx-auto px-4 py-8 min-h-screen'>
            {/* Invisible large bar at top */}
            <div className='h-4 mb-6'></div>
            
            {/*** Desktop version */}
            <div className='hidden lg:grid grid-cols-[250px,1fr] gap-8'>
                {/*** Left side (filters) */}
                <div className='bg-white p-6 rounded-lg shadow-sm sticky top-24 h-fit'> 
                    
                    {/** Sort by */}
                    <div className='mb-8'>
                        <h3 className='text-base uppercase font-medium text-slate-600 border-b pb-3 border-slate-200'>
                            {t('categoryProduct.sortBy')}
                        </h3>

                        <form className='text-sm flex flex-col gap-4 py-3'>
                            <div className='flex items-center gap-3'>
                                <input
                                    type='radio'
                                    name='sortBy'
                                    checked={sortBy === 'asc'}
                                    onChange={handleOnChangeSortBy}
                                    value={"asc"}
                                    className='accent-blue-600'
                                />
                                <label>{t('categoryProduct.priceLowToHigh')}</label>
                            </div>

                            <div className='flex items-center gap-3'>
                                <input
                                    type='radio'
                                    name='sortBy'
                                    checked={sortBy === 'dsc'}
                                    onChange={handleOnChangeSortBy}
                                    value={"dsc"}
                                    className='accent-blue-600'
                                />
                                <label>{t('categoryProduct.priceHighToLow')}</label>
                            </div>
                        </form>
                    </div>

                    {/** Filter by category */}
                    <div>
                        <h3 className='text-base uppercase font-medium text-slate-600 border-b pb-3 border-slate-200'>
                            {t('categoryProduct.category')}
                        </h3>

                        <form className='text-sm flex flex-col gap-4 py-3'>
                            {
                                productCategory.map((categoryName, index) => (
                                    <div key={index} className='flex items-center gap-3'>
                                        <input
                                            type='checkbox'
                                            name={"category"}
                                            checked={selectCategory[categoryName?.value]}
                                            value={categoryName?.value}
                                            id={categoryName?.value}
                                            onChange={handleSelectCategory}
                                            className='accent-blue-600'
                                        />
                                        <label htmlFor={categoryName?.value}>{categoryName?.label}</label>
                                    </div>
                                ))
                            }
                        </form>
                    </div>
                </div>

                {/*** Right side (products) */}
                <div className='px-4'>
                    <p className='font-medium text-slate-800 text-lg mb-6'>
                        {t('categoryProduct.searchResults')}: {data.length}
                    </p>

                    <div className='min-h-[calc(100vh-200px)]'>
                        {
                            data.length !== 0 && !loading && (
                                <VerticalCard data={data} loading={loading} />
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryProduct;