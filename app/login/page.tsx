'use client'
import CustomButton from '@/components/custom-button'
import { loginWithGoogle } from '@/lib/actions/auth.actions'
import { redirect } from 'next/navigation'
import React from 'react'

const Login = () => {
    const loginWithGoogleAuth = async () => {
        const user = await loginWithGoogle();
        if(user.data?.user){
            redirect("/")
        }
    }
  return (
    <div className='w-full h-full fixed flex items-center justify-center'>
      <div className='w-sm h-min bg-foreground/5 border border-foreground/5 rounded-xl p-5 space-y-5'>
        <p className='text-center text-xl'>Login to QuizComp Admin</p>
        <CustomButton onClick={loginWithGoogleAuth} className='w-full justify-center'>Continue with Google</CustomButton>
      </div>
    </div>
  )
}

export default Login
