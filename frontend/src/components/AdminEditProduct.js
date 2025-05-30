import React, { useState } from 'react'
import { CgClose } from "react-icons/cg";
import productCategory from '../helpers/productCategory';
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";

const AdminEditProduct = ({
  onClose,
  productData,
  fetchdata
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState({
    ...productData,
    productName: productData?.productName,
    brandName: productData?.brandName,
    category: productData?.category,
    productImage: productData?.productImage || [],
    description: productData?.description,
    price: productData?.price,
    sellingPrice: productData?.sellingPrice
  });
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => ({
      ...preve,
      [name]: value
    }));
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    const uploadImageCloudinary = await uploadImage(file);
    setData((preve) => ({
      ...preve,
      productImage: [...preve.productImage, uploadImageCloudinary.url]
    }));
  };

  const handleDeleteProductImage = async (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);
    setData((preve) => ({
      ...preve,
      productImage: [...newProductImage]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(SummaryApi.updateProduct.url, {
      method: SummaryApi.updateProduct.method,
      credentials: 'include',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();
    if (responseData.success) {
      toast.success(responseData?.message);
      onClose();
      fetchdata();
    }
    if (responseData.error) {
      toast.error(responseData?.message);
    }
  };

  return (
    <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
      <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
        <div className='flex justify-between items-center pb-3'>
          <h2 className='font-bold text-lg'>{t("admin.editProduct.title")}</h2>
          <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
            <CgClose />
          </div>
        </div>

        <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>
          <label htmlFor='productName'>{t("admin.editProduct.labels.productName")}</label>
          <input
            type='text'
            id='productName'
            placeholder={t("admin.editProduct.placeholders.productName")}
            name='productName'
            value={data.productName}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label htmlFor='brandName' className='mt-3'>{t("admin.editProduct.labels.brandName")}</label>
          <input
            type='text'
            id='brandName'
            placeholder={t("admin.editProduct.placeholders.brandName")}
            value={data.brandName}
            name='brandName'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label htmlFor='category' className='mt-3'>{t("admin.editProduct.labels.category")}</label>
          <select
            required
            value={data.category}
            name='category'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
          >
            <option value={""}>{t("admin.editProduct.placeholders.category")}</option>
            {Object.entries(t("categoryList.categories", { returnObjects: true })).map(([key, value]) => (
              <option value={key} key={key}>
                {value}
              </option>
            ))}
          </select>

          <label htmlFor='productImage' className='mt-3'>{t("admin.editProduct.labels.productImage")}</label>
          <label htmlFor='uploadImageInput'>
            <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer'>
              <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                <span className='text-4xl'><FaCloudUploadAlt /></span>
                <p className='text-sm'>{t("admin.editProduct.placeholders.uploadText")}</p>
                <input type='file' id='uploadImageInput' className='hidden' onChange={handleUploadProduct} />
              </div>
            </div>
          </label>

          <div>
            {data?.productImage[0] ? (
              <div className='flex items-center gap-2'>
                {data.productImage.map((el, index) => (
                  <div className='relative group' key={index}>
                    <img
                      src={el}
                      alt={el}
                      width={80}
                      height={80}
                      className='bg-slate-100 border cursor-pointer'
                      onClick={() => {
                        setOpenFullScreenImage(true);
                        setFullScreenImage(el);
                      }}
                    />
                    <div
                      className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer'
                      onClick={() => handleDeleteProductImage(index)}
                    >
                      <MdDelete />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-red-600 text-xs'>{t("admin.editProduct.validation.imageRequired")}</p>
            )}
          </div>

          <label htmlFor='price' className='mt-3'>{t("admin.editProduct.labels.price")}</label>
          <input
            type='number'
            id='price'
            placeholder={t("admin.editProduct.placeholders.price")}
            value={data.price}
            name='price'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label htmlFor='sellingPrice' className='mt-3'>{t("admin.editProduct.labels.sellingPrice")}</label>
          <input
            type='number'
            id='sellingPrice'
            placeholder={t("admin.editProduct.placeholders.sellingPrice")}
            value={data.sellingPrice}
            name='sellingPrice'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label htmlFor='description' className='mt-3'>{t("admin.editProduct.labels.description")}</label>
          <textarea
            className='h-28 bg-slate-100 border resize-none p-1'
            placeholder={t("admin.editProduct.placeholders.description")}
            rows={3}
            onChange={handleOnChange}
            name='description'
            value={data.description}
          />

          <button className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700'>
            {t("admin.editProduct.button")}
          </button>
        </form>
      </div>

      {openFullScreenImage && (
        <DisplayImage 
          onClose={() => setOpenFullScreenImage(false)} 
          imgUrl={fullScreenImage} 
          closeText={t("common.close")}
        />
      )}
    </div>
  );
};

export default AdminEditProduct;