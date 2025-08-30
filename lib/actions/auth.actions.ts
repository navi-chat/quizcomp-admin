import { redirect } from "next/navigation"
import { supabase } from "../supabase"


export const loginWithGoogle = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({provider: 'google', options: {redirectTo: 'http://localhost:3000/'}})
        if(error){
            return {data: null, error: error.message}
        }
        const { data: user } = await supabase.auth.getUser()
        return {data: user, error: null}
    } catch (error) {
        return {data: null, error: error}
    }
}

export const getUser = async () => {
    try {
        const { data, error } = await supabase.auth.getUser()

        if(error){
            return {data: null, error: error.message}
        }
        return {data: data, error: null}
    } catch (error) {
        return {data: null, error: error}
    }
}