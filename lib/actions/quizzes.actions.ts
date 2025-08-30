import { supabase } from "../supabase"
import { CreateQuizType } from "../types"
import { uploadFile } from "./storage.actions"

export const createQuiz = async (formData: CreateQuizType) => {
    try {
        const thumbnailUrl = await uploadFile(formData.thumbnail, `thumbnails/${formData.name.replaceAll(" ", '').toLocaleLowerCase()+new Date().toISOString()}.png`)
        if(thumbnailUrl.error){
            console.log(thumbnailUrl.error, thumbnailUrl.data)
            return {data: null, error: thumbnailUrl.error}
        }
        const { data, error } = await supabase
            .from("quizzes")
            .insert({...formData, thumbnail: thumbnailUrl.data})
            .select("*")

        if(error){
            return {data: null, error: error.message}
        }
        return {data: data, error: null}
    } catch (error) {
        return {data: null, error: error}
    }
}

export const getQuizzes = async () => {
    try {
        const { data, error } = await supabase
            .from("quizzes")
            .select("*")
            .order("date", {ascending: false})

        if(error){
            return {data: null, error: error.message}
        }
        return {data: data, error: null}
    } catch (error) {
        return {data: null, error: error}
    }
}

export const getQuizById = async (id: string) => {
    try {
        const { data, error } = await supabase
            .from("quizzes")
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

export const setQuizStatus = async (id: string, status: "draft" | "upcoming" | "live" | "finished") => {
    try {
        const { data, error } = await supabase
            .from("quizzes")
            .update({
                status: status
            })
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