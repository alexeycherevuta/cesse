import RequestMethods from '../../common/props/RequestMethods'
import RequestLifeCycles from '../../common/props/RequestLifeCycles'
export interface IBaseAppConfig {
  appName: string
  env: string
  baseUrl: string
  options: {
    compression: boolean
    prerender?: string[]
  }
  [key: string]: any
}
export interface IBaseAppProps {
  version: string
}
export interface IBaseAppRoute {
  label: string
  uri?: string
  component: any
  container?: any
  layout?: any
  exact?: boolean
  redirectTo?: string
}
export interface IBaseApiRoute {
  slug: string
  description: string
  url: string
  method: RequestMethods
  auth: boolean
}
export interface IBaseRequest {
  lifeCycle: RequestLifeCycles
  status: number | null
  statusText: string | null
  message?: string
  data: any
  headers: any
}
