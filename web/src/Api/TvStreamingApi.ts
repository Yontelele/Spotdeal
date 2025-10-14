import { Get } from "../Authorization/ApiHelper"
import { TvStreamingDto } from "../Models/TvStreamingDto"

export const fetchTvStreaming = async (operatorId: number): Promise<TvStreamingDto[]> => {
  return Get<TvStreamingDto[]>(`tv/${operatorId}`)
}
