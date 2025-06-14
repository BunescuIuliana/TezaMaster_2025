import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import App from '../App';
import Home from '../pages/Home';
import Login from '../pages/Login';
import ForgotPassowrd from '../pages/ForgotPassowrd';
import SignUp from '../pages/SignUp';
import AdminPanel from '../pages/AdminPanel';
import AllUsers from '../pages/AllUsers';
import AllProducts from '../pages/AllProducts';
import CategoryProduct from '../pages/CategoryProduct';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import SearchProduct from '../pages/SearchProduct';
import Blog from '../pages/Blog';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Discounts from '../pages/Discounts';
import Delivery from '../pages/Delivery';
import Payment from '../pages/Payment';
import i18n from '../i18n';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "forgot-password",
                element: <ForgotPassowrd />
            },
            {
                path: "sign-up",
                element: <SignUp />
            },
            {
                path: "product-category",
                element: <CategoryProduct />
            },
            {
                path: "product/:id",
                element: <ProductDetails />
            },
            {
                path: 'cart',
                element: <Cart />
            },
            {
                path: 'payment', // Added payment route under cart
                element: <Payment />
            },
            {
                path: "search",
                element: <SearchProduct />
            },
            {
                path: "admin-panel",
                element: <AdminPanel />,
                children: [
                    {
                        path: "all-users",
                        element: <AllUsers />
                    },
                    {
                        path: "all-products",
                        element: <AllProducts />
                    }
                ]
            },
            {
                path: "blog",
                element: <Blog />
            },
            {
                path: "about",
                element: <About />
            },
            {
                path: "contact",
                element: <Contact />
            },
            {
                path: "discounts",
                element: <Discounts />
            },
            {
                path: "delivery",
                element: <Delivery />
            }
        ]
    }
]);

export default router;