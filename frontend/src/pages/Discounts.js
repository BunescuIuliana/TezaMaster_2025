import React from 'react';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-6">
                {t('notFound.message')} {/* Translation key */}
            </p>
            <a
                href="/"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                {t('notFound.button')} {/* Translation key */}
            </a>
        </div>
    );
};

export default NotFound;
