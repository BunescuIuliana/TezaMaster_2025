import React, { useState } from 'react'
import ROLE from '../common/role'
import { IoMdClose } from "react-icons/io"
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

const ChangeUserRole = ({
  name,
  email,
  role,
  userId,
  onClose,
  callFunc,
}) => {
  const { t } = useTranslation()
  const [userRole, setUserRole] = useState(role)

  const handleOnChangeSelect = (e) => {
    setUserRole(e.target.value)
  }

  const updateUserRole = async () => {
    try {
      const fetchResponse = await fetch(SummaryApi.updateUser.url, {
        method: SummaryApi.updateUser.method,
        credentials: 'include',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          userId: userId,
          role: userRole
        })
      })

      const responseData = await fetchResponse.json()

      if (responseData.success) {
        toast.success(responseData.message)
        onClose()
        callFunc()
      } else {
        toast.error(responseData.message)
      }
    } catch (error) {
      toast.error(t('changeRole.updateError'))
      console.error("Update error:", error)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm'>
      <div className='bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold text-gray-800'>{t('changeRole.title')}</h2>
          <button 
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 transition-colors'
            aria-label={t('common.close')}
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className='space-y-4 mb-6'>
          <div className='flex flex-col'>
            <span className='text-sm font-medium text-gray-500'>{t('changeRole.name')}</span>
            <span className='text-lg'>{name}</span>
          </div>

          <div className='flex flex-col'>
            <span className='text-sm font-medium text-gray-500'>{t('changeRole.email')}</span>
            <span className='text-lg'>{email}</span>
          </div>

          <div className='flex flex-col'>
            <label htmlFor='role-select' className='text-sm font-medium text-gray-500 mb-1'>
              {t('changeRole.role')}
            </label>
            <select
              id='role-select'
              className='border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
              value={userRole}
              onChange={handleOnChangeSelect}
            >
              {Object.values(ROLE).map(el => (
                <option value={el} key={el}>
                  {t(`roles.${el.toLowerCase()}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button 
          onClick={updateUserRole}
          className='w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 shadow-md'
        >
          {t('changeRole.updateButton')}
        </button>
      </div>
    </div>
  )
}

export default ChangeUserRole