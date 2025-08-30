import { supabase } from "../supabase"
import { CreateQuestionType, CreateRoundType } from "../types"

export const getQuestionsByRoundId = async (round_id: string) => {
    try {
        const { data, error } = await supabase
            .from("questions")
            .select("*")
            .eq("round_id", round_id)
            .order("index", { ascending: true })

        if (error) {
            return { data: null, error: error.message }
        }
        return { data: data, error: null }
    } catch (error) {
        return { data: null, error: error }
    }
}

export const createQuestion = async (formData: CreateQuestionType) => {
    try {
        const res = await getQuestionsByRoundId(formData.round_id)
        if (res.error) {
            return { data: null, error: res.error }
        }
        const { data, error } = await supabase
            .from("questions")
            .insert({ ...formData, index: res.data?.length || 0 })
            .select("*")

        if (error) {
            return { data: null, error: error.message }
        }
        return { data: data, error: null }
    } catch (error) {
        return { data: null, error: error }
    }
}
