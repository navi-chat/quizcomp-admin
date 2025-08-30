'use client'
import React, { createContext, ReactNode, useEffect } from 'react'
import { getUser } from './actions/auth.actions'
import { redirect } from 'next/navigation'

const globalContext = createContext<undefined>(undefined)

const GlobalProvider = ({ children }: { children: ReactNode }) => {
    useEffect(() => {
        const initialCall = async () => {
            const user = await getUser();
            if(user.error){
                redirect('/login')
            }
        }
        initialCall()
    }, [])
  return (
    <globalContext.Provider value={undefined}>
        {children}
    </globalContext.Provider>
  )
}

export default GlobalProvider
