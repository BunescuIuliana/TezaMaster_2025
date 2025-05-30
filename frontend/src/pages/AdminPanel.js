import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';
import { useTranslation } from 'react-i18next';

const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();
    const { t } = useTranslation();
    
    useEffect(() => {
        if(user?.role !== ROLE.ADMIN){
           // navigate("/")
        }
    }, [user]);

    return (
        <div className='min-h-[calc(100vh-120px)] flex mt-16'>
            <aside className='bg-white min-h-full w-full max-w-64 shadow-lg rounded-r-xl border-r border-gray-100'>
                <div className='h-40 flex justify-center items-center flex-col space-y-2'>
                    <div className='text-5xl cursor-pointer relative flex justify-center text-blue-600'>
                        {user?.profilePic ? (
                            <img 
                                src={user?.profilePic} 
                                className='w-20 h-20 rounded-full object-cover border-2 border-blue-100'
                                alt={user?.name} 
                            />
                        ) : (
                            <FaRegCircleUser className='text-blue-500'/>
                        )}
                    </div>
                    <p className='capitalize text-lg font-semibold text-gray-800'>{user?.name}</p>
                    <p className='text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full'>
                        {user?.role}
                    </p>
                </div>

                <div className='px-2 py-4'>   
                    <nav className='space-y-1'>
                        <Link 
                            to={"all-users"} 
                            className='flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200'
                        >
                            <span className='ml-3'>{t('admin.allUsers')}</span>
                        </Link>
                        <Link 
                            to={"all-products"} 
                            className='flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200'
                        >
                            <span className='ml-3'>{t('admin.allProducts')}</span>
                        </Link>
                    </nav>
                </div>  
            </aside>

            <main className='w-full h-full p-6 overflow-auto bg-gray-50'>
                <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
                    <Outlet/>
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;