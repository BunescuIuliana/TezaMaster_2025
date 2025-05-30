import React from "react";
import { FaTruck, FaMapMarkerAlt, FaClock, FaPhoneAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Delivery = () => {
  const { t } = useTranslation();

  // Delivery costs in MDL
  const deliveryCosts = t("delivery.costs.list", { returnObjects: true });

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12 transform hover:scale-105 transition-transform duration-300">
          {t("delivery.title")}
        </h1>

        {/* About Delivery */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {t("delivery.about.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t("delivery.about.description")}
          </p>
        </div>

        {/* Delivery Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Delivery Zones */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <FaMapMarkerAlt className="text-blue-600 text-3xl mr-4" />
              <h3 className="text-xl font-semibold text-gray-800">
                {t("delivery.zones.title")}
              </h3>
            </div>
            <p className="text-gray-700 mb-4">
              {t("delivery.zones.description")}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {t("delivery.zones.cities", { returnObjects: true }).map((city, index) => (
                <li key={index}>{city}</li>
              ))}
            </ul>
          </div>

          {/* Delivery Time */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <FaClock className="text-blue-600 text-3xl mr-4" />
              <h3 className="text-xl font-semibold text-gray-800">
                {t("delivery.time.title")}
              </h3>
            </div>
            <p className="text-gray-700 mb-4">
              {t("delivery.time.description")}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {t("delivery.time.details", { returnObjects: true }).map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Delivery Costs */}
        <div className="bg-white p-8 rounded-xl shadow-lg mt-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center mb-6">
            <FaTruck className="text-blue-600 text-3xl mr-4" />
            <h3 className="text-xl font-semibold text-gray-800">
              {t("delivery.costs.title")}
            </h3>
          </div>
          <p className="text-gray-700 mb-4">
            {t("delivery.costs.description")}
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {deliveryCosts.map((cost, index) => (
              <li key={index}>{cost}</li>
            ))}
          </ul>
        </div>

        {/* Delivery Contact */}
        <div className="bg-white p-8 rounded-xl shadow-lg mt-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center mb-6">
            <FaPhoneAlt className="text-blue-600 text-3xl mr-4" />
            <h3 className="text-xl font-semibold text-gray-800">
              {t("delivery.contact.title")}
            </h3>
          </div>
          <p className="text-gray-700 mb-4">
            {t("delivery.contact.description")}
          </p>
          <ul className="text-gray-700 space-y-2">
            {t("delivery.contact.details", { returnObjects: true }).map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Delivery;