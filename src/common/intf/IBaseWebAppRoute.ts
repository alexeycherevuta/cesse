export interface IBaseWebAppRoute {
  label: string
  uri?: string
  component: any
  container?: any
  layout?: any
  exact?: boolean
  redirectTo?: string
}
