import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import loginIcons from '../assest/signin.webp';
import SummaryApi from '../common';
import Context from '../context';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState({
        email: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);
    const { t } = useTranslation();

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((preve) => ({
            ...preve,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!data.email || !data.password) {
            toast.error(t('login.all_fields_required'));
            return;
        }

        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            toast.error(t('login.invalid_email'));
            return;
        }

        setIsLoading(true);

        try {
            const dataResponse = await fetch(SummaryApi.signIn.url, {
                method: SummaryApi.signIn.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const dataApi = await dataResponse.json();

            if (dataApi.success) {
                toast.success(dataApi.message);
                navigate('/');
                fetchUserDetails();
                fetchUserAddToCart();
            } else {
                toast.error(dataApi.message);
            }
        } catch (error) {
            toast.error(t('login.login_failed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id='login' className='min-h-screen flex items-center justify-center bg-white'>
            <div className='bg-white p-8 rounded-lg shadow-xl w-full max-w-sm mx-4 border border-gray-100'>
                <div className='w-20 h-20 mx-auto'>
                    <img src={loginIcons} alt='login icons' className='w-full h-full object-cover' />
                </div>

                <form className='pt-6 flex flex-col gap-4' onSubmit={handleSubmit}>
                    {/** Email Input */}
                    <div className='grid gap-1'>
                        <label className='text-sm font-medium text-gray-700'>{t('login.email')}</label>
                        <div className='bg-slate-100 p-2 rounded-lg'>
                            <input
                                type='email'
                                placeholder={t('login.enter_email')}
                                name='email'
                                value={data.email}
                                onChange={handleOnChange}
                                className='w-full h-full outline-none bg-transparent text-sm'
                            />
                        </div>
                        <p className='text-xs text-gray-500 mt-1'>
                            {t('login.email_example')} (ex: user@example.com)
                        </p>
                    </div>

                    {/** Password Input */}
                    <div className='grid gap-1'>
                        <label className='text-sm font-medium text-gray-700'>{t('login.password')}</label>
                        <div className='bg-slate-100 p-2 rounded-lg flex items-center'>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder={t('login.enter_password')}
                                value={data.password}
                                name='password'
                                onChange={handleOnChange}
                                className='w-full h-full outline-none bg-transparent text-sm'
                            />
                            <div
                                className='cursor-pointer text-xl text-gray-500 hover:text-gray-700'
                                onClick={() => setShowPassword((preve) => !preve)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                        <Link
                            to={'/forgot-password'}
                            className='block w-fit ml-auto text-sm hover:underline hover:text-blue-600'
                        >
                            {t('login.forgot_password')}
                        </Link>
                    </div>

                    {/** Login Button */}
                    <button
                        type='submit'
                        disabled={isLoading}
                        className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 w-full rounded-lg transition-all flex items-center justify-center mt-4'
                    >
                        {isLoading ? (
                            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                        ) : (
                            t('login.login_button')
                        )}
                    </button>
                </form>

                {/** Sign Up Link */}
                <p className='text-center text-sm mt-6 text-gray-600'>
                    {t('login.dont_have_account')}{' '}
                    <Link to={"/sign-up"} className='text-blue-600 hover:text-blue-700 hover:underline'>
                        {t('login.sign_up')}
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Login;