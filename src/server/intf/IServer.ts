import { IBaseAppConfig } from '../../client/intf/IBase'
import { Request, Response, NextFunction } from 'express'
import RequestMethods from '../../common/props/RequestMethods'
export interface IWebServer {
  config: IBaseAppConfig
  staticRoutes: IWebServerStaticRoute[]
  apiRoutes: IWebServerApiRoute[]
  pathToIndex: string
  prerenderToken?: string
}
export interface IWebServerStaticRoute {
  uri: string
  path: string
}
export interface IWebServerApiRoute {
  uri: string
  method: RequestMethods
  controller: ExpressMiddleware
}
export type ExpressMiddleware = (req: Request, res: Response, err: NextFunction) => any
