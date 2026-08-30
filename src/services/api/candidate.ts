import { instance } from '@/services'
import type { Candidate, Stage } from '@/types/candidate'

export interface MoveStageParams {
  id: string
  toStage: Stage
}

export const candidateService = {
  getList: async (): Promise<Candidate[]> => {
    const { data } = await instance.get<Candidate[]>('/candidates')
    return data
  },

  getDetail: async (id: string): Promise<Candidate> => {
    if (!id) throw new Error('getDetail: id 가 비어 있습니다.')

    const { data } = await instance.get<Candidate>(`/candidates/${id}`)
    return data
  },

  moveStage: async ({ id, toStage }: MoveStageParams): Promise<Candidate> => {
    const { data } = await instance.patch<Candidate>(`/candidates/${id}`, { toStage })
    return data
  },
}
