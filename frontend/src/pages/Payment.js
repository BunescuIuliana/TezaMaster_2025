import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    deliveryMethod: 'courier',
    courierDetails: {
      address: {
        street: '',
        city: '',
        postalCode: '',
        region: 'Chișinău'
      },
      contactPhone: ''
    },
    pickupDetails: {
      pickupPoint: '',
      contactPhone: '',
      pickupDate: ''
    }
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [cardType, setCardType] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const regionsOfMoldova = [
    'Chișinău', 'Bălți', 'Tiraspol', 'Bender', 'Rîbnița', 'Cahul',
    'Ungheni', 'Soroca', 'Orhei', 'Comrat', 'Edineț', 'Strășeni',
    'Florești', 'Drochia', 'Călărași', 'Cimișlia', 'Glodeni', 'Hîncești'
  ];

  const pickupPoints = [
    t('payment.pickupPoints.center', { defaultValue: 'Centru' }),
    t('payment.pickupPoints.botanica', { defaultValue: 'Botanica' }),
    t('payment.pickupPoints.riscani', { defaultValue: 'Rîșcani' }),
    t('payment.pickupPoints.ciocana', { defaultValue: 'Ciocana' })
  ];

  const cardTypes = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$/,
    amex: /^3[47][0-9]{13}$/,
    discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    maestro: /^(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}$/
  };

  useEffect(() => {
    const cardNumber = formData.cardNumber.replace(/\s/g, '');
    if (cardNumber.length > 4) {
      for (const [type, pattern] of Object.entries(cardTypes)) {
        if (cardNumber.match(pattern)) {
          setCardType(type);
          return;
        }
      }
      setCardType(null);
    } else {
      setCardType(null);
    }
  }, [formData.cardNumber]);

  const formatCardNumber = (value) => {
    const v = value.replace(/\D/g, '');
    const parts = [];
    for (let i = 0; i < v.length && i < 16; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const formatPhoneNumber = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length <= 3) return v;
    if (v.length <= 6) return `${v.slice(0, 3)} ${v.slice(3)}`;
    return `${v.slice(0, 3)} ${v.slice(3, 6)} ${v.slice(6, 9)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('courier.')) {
      const parts = name.split('.');
      if (parts.length === 3) {
        const [_, mainField, subField] = parts;
        setFormData(prev => ({
          ...prev,
          courierDetails: {
            ...prev.courierDetails,
            [mainField]: {
              ...prev.courierDetails[mainField],
              [subField]: value
            }
          }
        }));
      } else {
        const [_, field] = parts;
        setFormData(prev => ({
          ...prev,
          courierDetails: {
            ...prev.courierDetails,
            [field]: field === 'contactPhone' ? formatPhoneNumber(value) : value
          }
        }));
      }
    } else if (name.startsWith('pickup.')) {
      const [_, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        pickupDetails: {
          ...prev.pickupDetails,
          [field]: field === 'contactPhone' ? formatPhoneNumber(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'cardNumber' ? formatCardNumber(value) :
                name === 'expiryDate' ? formatExpiryDate(value) :
                name === 'cvv' ? value.replace(/\D/g, '').slice(0, 4) :
                value
      }));
    }
  };

  const handleDeliveryMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      deliveryMethod: method,
      courierDetails: method === 'courier' ? prev.courierDetails : {
        address: {
          street: '',
          city: '',
          postalCode: '',
          region: 'Chișinău'
        },
        contactPhone: ''
      },
      pickupDetails: method === 'pickup' ? prev.pickupDetails : {
        pickupPoint: '',
        contactPhone: '',
        pickupDate: ''
      }
    }));

    setErrors(prev => {
      const newErrors = {...prev};
      if (method === 'courier') {
        delete newErrors.pickup;
      } else {
        delete newErrors.courier;
      }
      return newErrors;
    });
  };

  const validateExpiryDate = (expiryDate) => {
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryDate)) {
      return {
        isValid: false,
        error: t('payment.errors.expiryDateInvalid', { defaultValue: 'Format invalid. Folosiți MM/YY' })
      };
    }

    const [month, year] = expiryDate.split('/');
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    const expMonth = parseInt(month, 10);
    const expYear = parseInt(year, 10);

    if (expYear < currentYear || expYear > currentYear + 20) {
      return {
        isValid: false,
        error: t('payment.errors.expiryYearInvalid', { defaultValue: 'An invalid' })
      };
    }

    if (expMonth < 1 || expMonth > 12) {
      return {
        isValid: false,
        error: t('payment.errors.expiryMonthInvalid', { defaultValue: 'Lună invalidă (1-12)' })
      };
    }

    if (expYear === currentYear && expMonth < currentMonth) {
      return {
        isValid: false,
        error: t('payment.errors.expired', { defaultValue: 'Cardul a expirat' })
      };
    }

    return { isValid: true };
  };

  const validate = () => {
    const newErrors = {};
    const validatePhone = (phone) => /^0(6\d|7\d)\d{6}$/.test(phone.replace(/\s/g, ''));

    // Card validation
    if (!formData.cardName.trim()) newErrors.cardName = t('payment.errors.cardNameRequired', { defaultValue: 'Card name is required' });
    
    const cardNumber = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumber) {
      newErrors.cardNumber = t('payment.errors.cardNumberRequired', { defaultValue: 'Card number is required' });
    } else if (!/^\d{16}$/.test(cardNumber)) {
      newErrors.cardNumber = t('payment.errors.cardNumberInvalid', { defaultValue: 'Invalid card number' });
    }
    
    if (!formData.expiryDate) {
      newErrors.expiryDate = t('payment.errors.expiryDateRequired', { defaultValue: 'Expiry date is required' });
    } else {
      const validation = validateExpiryDate(formData.expiryDate);
      if (!validation.isValid) {
        newErrors.expiryDate = validation.error;
      }
    }
    
    if (!formData.cvv) {
      newErrors.cvv = t('payment.errors.cvvRequired', { defaultValue: 'CVV is required' });
    } else if ((cardType === 'amex' && formData.cvv.length !== 4) || 
               (cardType !== 'amex' && formData.cvv.length !== 3)) {
      newErrors.cvv = t('payment.errors.cvvInvalid', { defaultValue: 'Invalid CVV' });
    }

    // Delivery validation
    if (formData.deliveryMethod === 'courier') {
      const { contactPhone, address } = formData.courierDetails;
      if (!contactPhone) {
        newErrors.courier = { ...newErrors.courier, contactPhone: t('payment.errors.phoneRequired', { defaultValue: 'Phone is required' }) };
      } else if (!validatePhone(contactPhone)) {
        newErrors.courier = { ...newErrors.courier, contactPhone: t('payment.errors.phoneInvalid', { defaultValue: 'Invalid phone number' }) };
      }
      if (!address.street.trim()) newErrors.courier = { ...newErrors.courier, street: t('payment.errors.streetRequired', { defaultValue: 'Street is required' }) };
      if (!address.city.trim()) newErrors.courier = { ...newErrors.courier, city: t('payment.errors.cityRequired', { defaultValue: 'City is required' }) };
      if (!address.postalCode.trim()) newErrors.courier = { ...newErrors.courier, postalCode: t('payment.errors.postalCodeRequired', { defaultValue: 'Postal code is required' }) };
    }

    if (formData.deliveryMethod === 'pickup') {
      const { contactPhone, pickupPoint } = formData.pickupDetails;
      if (!contactPhone) {
        newErrors.pickup = { ...newErrors.pickup, contactPhone: t('payment.errors.phoneRequired', { defaultValue: 'Phone is required' }) };
      } else if (!validatePhone(contactPhone)) {
        newErrors.pickup = { ...newErrors.pickup, contactPhone: t('payment.errors.phoneInvalid', { defaultValue: 'Invalid phone number' }) };
      }
      if (!pickupPoint) newErrors.pickup = { ...newErrors.pickup, pickupPoint: t('payment.errors.pickupPointRequired', { defaultValue: 'Pickup point is required' }) };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(t('payment.successMessage', { defaultValue: 'Payment successful!' }));
      setPaymentSuccess(true);
      
      // Reset form
      setFormData({
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        deliveryMethod: 'courier',
        courierDetails: {
          address: { street: '', city: '', postalCode: '', region: 'Chișinău' },
          contactPhone: ''
        },
        pickupDetails: { pickupPoint: '', contactPhone: '', pickupDate: '' }
      });

      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      toast.error(t('payment.errors.paymentFailed', { defaultValue: 'Payment failed. Please try again.' }));
    } finally {
      setProcessing(false);
    }
  };

  const CardIcons = () => (
    <div className="flex space-x-2">
      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-8" />
      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8" />
      <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_(2018).svg" alt="Amex" className="h-8" />
    </div>
  );

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center">
          <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            {t('payment.successTitle', { defaultValue: 'Payment Successful!' })}
          </h2>
          <p className="mt-2 text-gray-600">
            {t('payment.successDescription', { defaultValue: 'Thank you for your purchase! You will be redirected to home page shortly.' })}
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {t('payment.goToHome', { defaultValue: 'Go to Home Now' })}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {t('payment.title', { defaultValue: 'Payment' })}
          </h2>
          {cardType && (
            <img
              src={`https://logo.clearbit.com/${cardType}.com`}
              alt={cardType}
              className="h-8"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">
              {t('payment.paymentDetails', { defaultValue: 'Payment Details' })}
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('payment.cardName', { defaultValue: 'Name on Card' })}
              </label>
              <input
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded border ${errors.cardName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder={t('payment.cardNamePlaceholder', { defaultValue: 'John Doe' })}
                autoComplete="cc-name"
              />
              {errors.cardName && <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('payment.cardNumber', { defaultValue: 'Card Number' })}
              </label>
              <input
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                inputMode="numeric"
                autoComplete="cc-number"
              />
              {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('payment.expiryDate', { defaultValue: 'Expiry Date' })}
                </label>
                <input
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded border ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="MM/YY"
                  maxLength={5}
                  autoComplete="cc-exp"
                />
                {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('payment.cvv', { defaultValue: 'CVV' })}
                </label>
                <input
                  type="password"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder={cardType === 'amex' ? '1234' : '123'}
                  maxLength={4}
                  inputMode="numeric"
                  autoComplete="cc-csc"
                />
                {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
              </div>
            </div>
          </div>

          {/* Delivery Method */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">
              {t('payment.chooseDeliveryMethod', { defaultValue: 'Choose Delivery Method' })}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDeliveryMethodChange('courier')}
                className={`py-2 px-4 rounded border ${formData.deliveryMethod === 'courier' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300'}`}
              >
                {t('payment.deliveryCourier', { defaultValue: 'Courier Delivery' })}
              </button>
              <button
                type="button"
                onClick={() => handleDeliveryMethodChange('pickup')}
                className={`py-2 px-4 rounded border ${formData.deliveryMethod === 'pickup' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300'}`}
              >
                {t('payment.deliveryPickup', { defaultValue: 'Store Pickup' })}
              </button>
            </div>
          </div>

          {/* Courier Details */}
          {formData.deliveryMethod === 'courier' && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium text-gray-800">
                {t('payment.deliveryAddress', { defaultValue: 'Delivery Address' })}
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('payment.contactPhone', { defaultValue: 'Contact Phone' })}
                </label>
                <input
                  name="courier.contactPhone"
                  value={formData.courierDetails.contactPhone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded border ${errors.courier?.contactPhone ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="060 123 456"
                  maxLength={11}
                  inputMode="tel"
                />
                {errors.courier?.contactPhone && <p className="mt-1 text-sm text-red-600">{errors.courier.contactPhone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('payment.address.region', { defaultValue: 'Region' })}
                </label>
                <select
                  name="courier.address.region"
                  value={formData.courierDetails.address.region}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {regionsOfMoldova.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('payment.address.city', { defaultValue: 'City' })}
                </label>
                <input
                  name="courier.address.city"
                  value={formData.courierDetails.address.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded border ${errors.courier?.city ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder={t('payment.address.cityPlaceholder', { defaultValue: 'Enter your city' })}
                />
                {errors.courier?.city && <p className="mt-1 text-sm text-red-600">{errors.courier.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('payment.address.street', { defaultValue: 'Street' })}
                </label>
                <input
                  name="courier.address.street"
                  value={formData.courierDetails.address.street}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded border ${errors.courier?.street ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder={t('payment.address.streetPlaceholder', { defaultValue: 'Enter your street' })}
                />
                {errors.courier?.street && <p className="mt-1 text-sm text-red-600">{errors.courier.street}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('payment.address.postalCode', { defaultValue: 'Postal Code' })}
                </label>
                <input
                  name="courier.address.postalCode"
                  value={formData.courierDetails.address.postalCode}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded border ${errors.courier?.postalCode ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="MD-2000"
                />
                {errors.courier?.postalCode && <p className="mt-1 text-sm text-red-600">{errors.courier.postalCode}</p>}
              </div>
            </div>
          )}

          {/* Pickup Details */}
          {formData.deliveryMethod === 'pickup' && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium text-gray-800">
                {t('payment.pickupDetails', { defaultValue: 'Pickup Details' })}
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('payment.contactPhone', { defaultValue: 'Contact Phone' })}
                </label>
                <input
                  name="pickup.contactPhone"
                  value={formData.pickupDetails.contactPhone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded border ${errors.pickup?.contactPhone ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="060 123 456"
                  maxLength={11}
                  inputMode="tel"
                />
                {errors.pickup?.contactPhone && <p className="mt-1 text-sm text-red-600">{errors.pickup.contactPhone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('payment.pickupPoint', { defaultValue: 'Pickup Point' })}
                </label>
                <select
                  name="pickup.pickupPoint"
                  value={formData.pickupDetails.pickupPoint}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded border ${errors.pickup?.pickupPoint ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">{t('payment.selectPickupPoint', { defaultValue: 'Select pickup point' })}</option>
                  {pickupPoints.map((point, index) => (
                    <option key={index} value={point}>{point}</option>
                  ))}
                </select>
                {errors.pickup?.pickupPoint && <p className="mt-1 text-sm text-red-600">{errors.pickup.pickupPoint}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('payment.pickupDate', { defaultValue: 'Pickup Date' })}
                </label>
                <input
                  type="date"
                  name="pickup.pickupDate"
                  value={formData.pickupDetails.pickupDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={processing}
            className={`w-full py-3 px-4 rounded font-semibold text-white ${processing ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors shadow`}
          >
            {processing ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('payment.processing', { defaultValue: 'Processing...' })}
              </div>
            ) : t('payment.payButton', { defaultValue: 'Pay Now' })}
          </button>
        </form>

        {/* Footer Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {t('payment.acceptedCards', { defaultValue: 'Accepted cards' })}
            </span>
            <CardIcons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;