import { AxiosResponse } from 'axios'
export interface IAjax {
  make(routeSlug: string, options: IAjaxOptions): Promise<AxiosResponse>
}
export interface IAjaxOptions {
  token?: string
  data?: any
}
