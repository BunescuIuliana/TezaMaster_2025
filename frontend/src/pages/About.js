import React from "react";
import { FaShippingFast, FaShieldAlt, FaHeadset, FaSmile } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <div title={t("about.title")}>
      <div className="bg-gradient-to-r from-blue-50 to-blue-50 py-16 px-6 min-h-screen flex flex-col justify-center items-center">
        <div className="max-w-6xl mx-auto bg-white p-10 rounded-3xl shadow-2xl text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-8">
            {t("about.mainTitle")} <span className="text-blue-600">{t("about.smartStore")}</span>
          </h1>

          <div className="mb-10">
            <img
              src="https://images.unsplash.com/photo-1556740714-a8395b3bf30f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt={t("about.imageAlt")}
              className="w-full h-96 object-cover rounded-xl shadow-md"
            />
          </div>

          <div className="text-gray-700 leading-relaxed text-lg space-y-6">
            <p>
              {t("about.welcomeMessage")} <span className="font-semibold text-blue-600">{t("about.smartStore")}</span>! 
              {t("about.description1")}
            </p>
            <p>
              {t("about.description2")}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center">
                <FaShippingFast className="text-5xl text-blue-600 mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("about.fastShippingTitle")}
              </h3>
              <p className="text-gray-600">
                {t("about.fastShippingDescription")}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center">
                <FaShieldAlt className="text-5xl text-blue-600 mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("about.securePaymentsTitle")}
              </h3>
              <p className="text-gray-600">
                {t("about.securePaymentsDescription")}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center">
                <FaHeadset className="text-5xl text-blue-600 mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("about.customerSupportTitle")}
              </h3>
              <p className="text-gray-600">
                {t("about.customerSupportDescription")}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center">
                <FaSmile className="text-5xl text-blue-600 mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("about.customerSatisfactionTitle")}
              </h3>
              <p className="text-gray-600">
                {t("about.customerSatisfactionDescription")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;