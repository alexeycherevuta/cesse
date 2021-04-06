import RequestMethods from '../../common/props/RequestMethods'
import { IBaseApiRoute } from '../intf/IBase'
import { IKeyAny } from '../../common/intf/IKeyAny'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
interface IAgentHelper {
  make(routeSlug: string, options: IAgentHelperPrepareOptions): Promise<AxiosResponse>
}
interface IAgentHelperPrepareOptions {
  token?: string
  data?: any
}
export default class AgentHelper implements IAgentHelper {
  private routes: IBaseApiRoute[]
  private options: AxiosRequestConfig
  constructor(routes: IBaseApiRoute[], options: AxiosRequestConfig) {
    this.routes = routes
    this.options = options
  }
  public async make(routeSlug: string, options: IAgentHelperPrepareOptions = {}): Promise<AxiosResponse> {
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
      case RequestMethods.POST:
        return axiosInstance.post(route.url, options.data, { headers })
      case RequestMethods.GET:
      default:
        return axiosInstance.get(route.url, { headers })
    }
  }
}
