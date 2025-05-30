import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import moment from 'moment'
import { MdModeEdit } from "react-icons/md"
import ChangeUserRole from '../components/ChangeUserRole'
import { useTranslation } from 'react-i18next'

const AllUsers = () => {
    const { t } = useTranslation()
    const [allUser, setAllUsers] = useState([])
    const [openUpdateRole, setOpenUpdateRole] = useState(false)
    const [updateUserDetails, setUpdateUserDetails] = useState({
        email: "",
        name: "",
        role: "",
        _id: ""
    })

    const fetchAllUsers = async() => {
        const fetchData = await fetch(SummaryApi.allUser.url, {
            method: SummaryApi.allUser.method,
            credentials: 'include'
        })

        const dataResponse = await fetchData.json()

        if(dataResponse.success) {
            setAllUsers(dataResponse.data)
        }

        if(dataResponse.error) {
            toast.error(dataResponse.message)
        }
    }

    useEffect(() => {
        fetchAllUsers()
    }, [])

    return (
        <div className='bg-white pb-4'>
            <table className='w-full userTable'>
                <thead>
                    <tr className='bg-black text-white'>
                        <th>{t('allUsers.sr')}</th>
                        <th>{t('allUsers.name')}</th>
                        <th>{t('allUsers.email')}</th>
                        <th>{t('allUsers.role')}</th>
                        <th>{t('allUsers.createdDate')}</th>
                        <th>{t('allUsers.action')}</th>
                    </tr>
                </thead>
                <tbody className=''>
                    {
                        allUser.map((el, index) => {
                            return(
                                <tr key={el._id}>
                                    <td>{index+1}</td>
                                    <td>{el?.name}</td>
                                    <td>{el?.email}</td>
                                    <td>{el?.role}</td>
                                    <td>{moment(el?.createdAt).format('LL')}</td>
                                    <td>
                                        <button 
                                            className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white transition-all'
                                            onClick={() => {
                                                setUpdateUserDetails(el)
                                                setOpenUpdateRole(true)
                                            }}
                                        >
                                            <MdModeEdit/>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

            {
                openUpdateRole && (
                    <ChangeUserRole 
                        onClose={() => setOpenUpdateRole(false)} 
                        name={updateUserDetails.name}
                        email={updateUserDetails.email}
                        role={updateUserDetails.role}
                        userId={updateUserDetails._id}
                        callFunc={fetchAllUsers}
                    />
                )      
            }
        </div>
    )
}

export default AllUsers