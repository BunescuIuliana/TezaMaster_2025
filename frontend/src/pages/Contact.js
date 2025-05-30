import React from "react";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div title={t("contact.title")}>
      {/* Main Contact Section */}
      <div className="min-h-full bg-gradient-to-r from-blue-50 to-blue-50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
            {t("contact.mainTitle")} <span className="text-blue-600">{t("contact.smartStore")}</span>
          </h1>

          {/* Contact Info and Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t("contact.getInTouch")}
              </h2>
              <p className="text-gray-600 mb-6">
                {t("contact.getInTouchDescription")}
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-full">
                    <BiMailSend className="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold">{t("contact.email")}</p>
                    <p className="text-gray-600">support@smartstore.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-full">
                    <BiPhoneCall className="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold">{t("contact.phone")}</p>
                    <p className="text-gray-600">+123-456-7890</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-full">
                    <BiSupport className="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold">{t("contact.support")}</p>
                    <p className="text-gray-600">1800-1111-2222 (Toll Free)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t("contact.sendMessage")}
              </h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    {t("contact.name")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder={t("contact.namePlaceholder")}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t("contact.email")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder={t("contact.emailPlaceholder")}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    {t("contact.message")}
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder={t("contact.messagePlaceholder")}
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    {t("contact.sendButton")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t("contact.bannerTitle")}
            </h2>
            <p className="text-gray-300 mb-8">
              {t("contact.bannerDescription")}
            </p>
            <img
              src="https://source.unsplash.com/1200x400/?customer-service,help"
              alt={t("contact.bannerImageAlt")}
              className="w-full h-auto max-w-4xl mx-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;