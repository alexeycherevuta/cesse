export interface IBaseApiRoute {
  slug: string
  description: string
  url: string
  method: 'post' | 'get' | 'delete' | 'put' | 'patch' | 'options' 
  auth: boolean
}
