'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { UserContext } from '@/context/UserContext'

function Provider({children}: any) {
    const [userDetail, setUserDetail] = useState<any>(null)
    useEffect(() => {
        CreateNewUser()
    }, [])

    const CreateNewUser = async () => {
        const res = await axios.post('/api/user', {})
        setUserDetail(res.data)
    }

    return (
    <UserContext.Provider value={{userDetail, setUserDetail}}>
        <div>{children}</div>
    </UserContext.Provider>
  )
}

export default Provider