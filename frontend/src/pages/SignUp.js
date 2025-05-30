import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import loginIcons from '../assest/signin.webp';
import imageTobase64 from '../helpers/imageTobase64';
import SummaryApi from '../common';

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [data, setData] = useState({
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
        profilePic: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((preve) => ({
            ...preve,
            [name]: value
        }));
    };

    const handleUploadPic = async (e) => {
        const file = e.target.files[0];
        const imagePic = await imageTobase64(file);
        setData((preve) => ({
            ...preve,
            profilePic: imagePic
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (data.password !== data.confirmPassword) {
            toast.error(t('signup.password_mismatch'));
            return;
        }

        setIsLoading(true);

        try {
            const dataResponse = await fetch(SummaryApi.signUP.url, {
                method: SummaryApi.signUP.method,
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const dataApi = await dataResponse.json();

            if (dataApi.success) {
                toast.success(dataApi.message);
                navigate("/login");
            } else {
                toast.error(dataApi.message);
            }
        } catch (error) {
            toast.error(t('signup.signup_failed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id='signup' className='min-h-screen flex items-center justify-center bg-white'>
            <div className='bg-white p-8 rounded-lg shadow-xl w-full max-w-sm mx-4 border border-gray-100'>
                <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
                    <div>
                        <img src={data.profilePic || loginIcons} alt='profile icon' className='w-full h-full object-cover' />
                    </div>
                    <form>
                        <label>
                            <div className='text-xs bg-opacity-80 bg-slate-200 pb-4 pt-2 cursor-pointer text-center absolute bottom-0 w-full'>
                                {t('signup.upload_photo')}
                            </div>
                            <input type='file' className='hidden' onChange={handleUploadPic} />
                        </label>
                    </form>
                </div>

                <form className='pt-6 flex flex-col gap-4' onSubmit={handleSubmit}>
                    {/** Name Input */}
                    <div className='grid gap-1'>
                        <label className='text-sm font-medium text-gray-700'>{t('signup.name')}</label>
                        <div className='bg-slate-100 p-2 rounded-lg'>
                            <input
                                type='text'
                                placeholder={t('signup.enter_name')}
                                name='name'
                                value={data.name}
                                onChange={handleOnChange}
                                required
                                className='w-full h-full outline-none bg-transparent text-sm'
                            />
                        </div>
                    </div>

                    {/** Email Input */}
                    <div className='grid gap-1'>
                        <label className='text-sm font-medium text-gray-700'>{t('signup.email')}</label>
                        <div className='bg-slate-100 p-2 rounded-lg'>
                            <input
                                type='email'
                                placeholder={t('signup.enter_email')}
                                name='email'
                                value={data.email}
                                onChange={handleOnChange}
                                required
                                className='w-full h-full outline-none bg-transparent text-sm'
                            />
                        </div>
                    </div>

                    {/** Password Input */}
                    <div className='grid gap-1'>
                        <label className='text-sm font-medium text-gray-700'>{t('signup.password')}</label>
                        <div className='bg-slate-100 p-2 rounded-lg flex items-center'>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder={t('signup.enter_password')}
                                value={data.password}
                                name='password'
                                onChange={handleOnChange}
                                required
                                className='w-full h-full outline-none bg-transparent text-sm'
                            />
                            <div
                                className='cursor-pointer text-xl text-gray-500 hover:text-gray-700'
                                onClick={() => setShowPassword((preve) => !preve)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                    </div>

                    {/** Confirm Password Input */}
                    <div className='grid gap-1'>
                        <label className='text-sm font-medium text-gray-700'>{t('signup.confirm_password')}</label>
                        <div className='bg-slate-100 p-2 rounded-lg flex items-center'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder={t('signup.enter_confirm_password')}
                                value={data.confirmPassword}
                                name='confirmPassword'
                                onChange={handleOnChange}
                                required
                                className='w-full h-full outline-none bg-transparent text-sm'
                            />
                            <div
                                className='cursor-pointer text-xl text-gray-500 hover:text-gray-700'
                                onClick={() => setShowConfirmPassword((preve) => !preve)}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                    </div>

                    {/** Sign Up Button */}
                    <button
                        type='submit'
                        disabled={isLoading}
                        className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 w-full rounded-lg transition-all flex items-center justify-center mt-4'
                    >
                        {isLoading ? (
                            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                        ) : (
                            t('signup.sign_up')
                        )}
                    </button>
                </form>

                {/** Login Link */}
                <p className='text-center text-sm mt-6 text-gray-600'>
                    {t('signup.already_have_account')}{' '}
                    <Link to={"/login"} className='text-blue-600 hover:text-blue-700 hover:underline'>
                        {t('signup.login')}
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default SignUp;