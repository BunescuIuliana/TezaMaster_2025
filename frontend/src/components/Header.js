import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "antd";
import { FaUserCircle, FaShoppingCart, FaPhone, FaClock } from "react-icons/fa";
import { GrSearch } from "react-icons/gr";
import { toast } from "react-hot-toast";
import SummaryApi from "../common";
import { setUserDetails } from "../store/userSlice";
import ROLE from "../common/role";
import Context from "../context";
import logo from "../assest/logo.svg";
import { useTranslation } from "react-i18next";

const Header = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const context = useContext(Context);
  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  const [search, setSearch] = useState(searchQuery);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const { t, i18n } = useTranslation();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
    });

    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate("/");
    }

    if (data.error) {
      toast.error(data.message);
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);

    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    setIsLanguageMenuOpen(false);
  };

  const languageOptions = [
    { key: "ro", label: "RO", icon: "https://flagcdn.com/ro.svg" },
    { key: "ru", label: "RU", icon: "https://flagcdn.com/ru.svg" },
    { key: "en", label: "EN", icon: "https://flagcdn.com/gb.svg" },
  ];

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-10">
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaPhone className="text-sm text-blue-400" />
              <span className="text-gray-300">+373 123 456 789</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaClock className="text-sm text-blue-400" />
              <span className="text-gray-300">{t("header.workingHours")}</span>
            </div>
          </div>

          <div className="flex-grow max-w-2xl mx-4">
            <div className="flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow pl-2 bg-white">
              <input
                type="text"
                placeholder={t("header.searchPlaceholder")}
                className="w-full outline-none text-gray-800 placeholder-gray-400"
                onChange={handleSearch}
                value={search}
              />
              <div className="text-lg min-w-[50px] h-8 bg-blue-600 flex items-center justify-center rounded-r-full text-white">
                <GrSearch />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-2 bg-transparent text-gray-300 border-none focus:outline-none hover:text-blue-400 transition-colors duration-300"
              >
                <img
                  src={languageOptions.find((lang) => lang.key === language)?.icon}
                  alt={language}
                  className="w-5 h-5"
                />
                <span>{languageOptions.find((lang) => lang.key === language)?.label}</span>
              </button>
              {isLanguageMenuOpen && (
                <div className="absolute bg-white shadow-xl rounded-lg mt-2 py-2 w-24 right-0 z-50">
                  {languageOptions.map((lang) => (
                    <button
                      key={lang.key}
                      onClick={() => handleLanguageChange(lang.key)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300 w-full"
                    >
                      <img src={lang.icon} alt={lang.key} className="w-5 h-5" />
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="logo"
              className="w-60 hover:opacity-80 transition-opacity duration-300"
            />
          </Link>

          <div className="flex items-center space-x-8">
            <NavLink
              to="/"
              className="text-gray-800 hover:text-blue-600 text-lg font-medium transition-colors duration-300"
            >
              {t("header.home")}
            </NavLink>
            <NavLink
              to="/about"
              className="text-gray-800 hover:text-blue-600 text-lg font-medium transition-colors duration-300"
            >
              {t("header.about")}
            </NavLink>
            <NavLink
              to="/delivery"
              className="text-gray-800 hover:text-blue-600 text-lg font-medium transition-colors duration-300"
            >
              {t("header.delivery")}
            </NavLink>
            <NavLink
              to="/discounts"
              className="text-gray-800 hover:text-blue-600 text-lg font-medium transition-colors duration-300"
            >
              {t("header.discounts")}
            </NavLink>
            <NavLink
              to="/contact"
              className="text-gray-800 hover:text-blue-600 text-lg font-medium transition-colors duration-300"
            >
              {t("header.contact")}
            </NavLink>
            <NavLink
              to="/blog"
              className="text-gray-800 hover:text-blue-600 text-lg font-medium transition-colors duration-300"
            >
              {t("header.blog")}
            </NavLink>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative" ref={userMenuRef}>
              <button
                aria-label="User Menu"
                className="text-gray-800 hover:text-blue-600 text-lg font-medium flex items-center focus:outline-none transition-colors duration-300"
                onClick={toggleUserMenu}
              >
                <FaUserCircle 
                  size={32} 
                  className={`hover:scale-110 transition-transform duration-300 ${user ? "text-blue-600" : "text-gray-600"}`} 
                />
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute bg-white shadow-xl rounded-lg mt-2 py-2 w-56 right-0 z-50">
                  {!user ? (
                    <>
                      <NavLink
                        to="/login"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {t("header.login")}
                      </NavLink>
                      <NavLink
                        to="/sign-up"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {t("header.register")}
                      </NavLink>
                    </>
                  ) : (
                    <>
                      {user?.role === ROLE.ADMIN && (
                        <NavLink
                          to="/admin-panel"
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {t("header.adminPanel")}
                        </NavLink>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300 w-full text-left"
                      >
                        {t("header.logout")}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <NavLink
              to="/cart"
              className="text-gray-800 hover:text-blue-600 text-lg font-medium transition-colors duration-300"
            >
              <Badge 
                count={context?.cartProductCount || 0} 
                showZero 
                offset={[10, -5]}
                className="ant-scroll-number-custom"
              >
                <FaShoppingCart size={32} className="hover:scale-110 transition-transform duration-300" />
              </Badge>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;