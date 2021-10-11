export interface IBaseWebAppConfig {
  appName: string
  env: string
  baseUrl: string
  options: {
    compression: boolean
    prerender?: string[]
  }
  [key: string]: any
}
