import { supabase } from "../supabase"

export const getUserById = async (id: string) => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", id)
            .single()

        if(error){
            return {data: null, error: error.message}
        }
        return {data: data, error: null}
    } catch (error) {
        return {data: null, error: error}
    }
}
