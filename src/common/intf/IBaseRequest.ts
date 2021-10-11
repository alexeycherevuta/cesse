export interface IBaseRequest {
  lifeCycle: string 
  status: number | null
  statusText: string | null
  message?: string
  data: any
  headers: any
}
