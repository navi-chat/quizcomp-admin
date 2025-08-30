import { supabase } from "../supabase"
import { CreateRoundType } from "../types"

export const getRoundsByQuizId = async (quiz_id: string) => {
    try {
        const { data, error } = await supabase
            .from("rounds")
            .select("*")
            .eq("quiz_id", quiz_id)
            .order("index", { ascending: true })

        if (error) {
            return { data: null, error: error.message }
        }
        return { data: data, error: null }
    } catch (error) {
        return { data: null, error: error }
    }
}

export const createRound = async (formData: CreateRoundType, quiz_id: string) => {
    try {
        const res = await getRoundsByQuizId(quiz_id)
        if (res.error) {
            return { data: null, error: res.error }
        }
        const { data, error } = await supabase
            .from("rounds")
            .insert({ ...formData, index: res.data?.length || 0, quiz_id: quiz_id })
            .select("*")

        if (error) {
            return { data: null, error: error.message }
        }
        return { data: data, error: null }
    } catch (error) {
        return { data: null, error: error }
    }
}
