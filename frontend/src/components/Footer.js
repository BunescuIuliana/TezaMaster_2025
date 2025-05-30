import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaCcVisa, FaCcMastercard, FaPaypal } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-400">
              {t("footer.quickLinks.title")}
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-blue-400 transition duration-300 hover:underline hover:pl-2">
                  {t("footer.quickLinks.aboutUs")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition duration-300 hover:underline hover:pl-2">
                  {t("footer.quickLinks.contact")}
                </Link>
              </li>
              <li>
                <Link to="/policy" className="text-gray-300 hover:text-blue-400 transition duration-300 hover:underline hover:pl-2">
                  {t("footer.quickLinks.privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-blue-400 transition duration-300 hover:underline hover:pl-2">
                  {t("footer.quickLinks.termsConditions")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-400">
              {t("footer.contact.title")}
            </h3>
            <ul className="text-gray-300 space-y-4">
              <li className="flex items-center space-x-2">
                <span>📧</span>
                <span>{t("footer.contact.email")}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📞</span>
                <span>{t("footer.contact.phone")}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📍</span>
                <span>{t("footer.contact.address")}</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-400">
              {t("footer.socialMedia.title")}
            </h3>
            <div className="flex space-x-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition duration-300 hover:scale-110">
                <FaFacebook size={28} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition duration-300 hover:scale-110">
                <FaTwitter size={28} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition duration-300 hover:scale-110">
                <FaInstagram size={28} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition duration-300 hover:scale-110">
                <FaLinkedin size={28} />
              </a>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-col items-start space-y-6 md:items-center lg:items-start">
            <h3 className="text-xl font-bold mb-6 text-blue-400">
              {t("footer.paymentMethods.title")}
            </h3>
            <div className="flex space-x-6">
              <FaCcVisa size={36} className="text-gray-300 hover:text-blue-400 transition duration-300 hover:scale-110" />
              <FaCcMastercard size={36} className="text-gray-300 hover:text-blue-400 transition duration-300 hover:scale-110" />
              <FaPaypal size={36} className="text-gray-300 hover:text-blue-400 transition duration-300 hover:scale-110" />
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="border-t border-gray-700 pt-8">
          <p className="text-gray-300 text-center">
            &copy; {new Date().getFullYear()} {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;