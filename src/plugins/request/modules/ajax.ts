import { IAjax, IAjaxOptions } from '../intf/IAjax'
import { IKeyAny } from '../../../common/intf/IKeyAny'
import { IBaseApiRoute } from '../../../common/intf/IBaseApiRoute'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
export default class Ajax implements IAjax {
  private routes: IBaseApiRoute[]
  private options: AxiosRequestConfig
  constructor(routes: IBaseApiRoute[], options: AxiosRequestConfig) {
    this.routes = routes
    this.options = options
  }
  public async make(routeSlug: string, options: IAjaxOptions = {}): Promise<AxiosResponse> {
    const headers: IKeyAny = {}
    const axiosOptions = {...this.options}
    const route = this.routes.find((r: IBaseApiRoute) => r.slug === routeSlug)
    if (!route) {
      throw new Error('Route not found!')
    }
    if (route.url.indexOf(':
      axiosOptions.baseURL = ''
    }
    if (route.auth) {
      if (!options.token) {
        throw new Error(`Token not found but the route "${route.slug}" requires authorisation`)
      }
      headers['Authorization'] = `Bearer ${options.token}`
    }
    const axiosInstance = axios.create(axiosOptions)
    switch (route.method) {
      case 'post':
        return axiosInstance.post(route.url, options.data, { headers })
      case 'get':
        return axiosInstance.get(route.url, { headers })
      case 'delete':
        return axiosInstance.delete(route.url, { headers })
      case 'put':
        return axiosInstance.put(route.url, options.data, { headers })
      case 'options':
        return axiosInstance.options(route.url, { headers })
      case 'patch':
        return axiosInstance.patch(route.url, options.data, { headers })
      default:
        throw new Error('Unknown request method')
    }
  }
}
