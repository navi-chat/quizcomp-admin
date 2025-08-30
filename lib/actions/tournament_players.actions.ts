import { supabase } from "../supabase"

export const getTournamentPlayersByQuizId = async (quiz_id: string) => {
    try {
        const { data, error } = await supabase
            .from("tournament_players")
            .select("*")
            .eq("quiz_id", quiz_id)
            .order("created_at", {ascending: false})

        if(error){
            return {data: null, error: error.message}
        }
        return {data: data, error: null}
    } catch (error) {
        return {data: null, error: error}
    }
}