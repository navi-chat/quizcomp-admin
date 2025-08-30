import { supabase } from "../supabase"

export const uploadFile = async (file: File, path: string) => {
    try {
        
        const { data, error } = await supabase
            .storage
            .from('images')
            .upload(path, file)

        if(error){
            return {data: null, error: error.message}
        }
        const fileUrl = supabase.storage.from("images").getPublicUrl(path)
        return {data: fileUrl.data.publicUrl, error: null}
    } catch (error) {
        return {data: null, error: error}
    }
}