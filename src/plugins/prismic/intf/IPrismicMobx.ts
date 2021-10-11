import { IPrismicComponentParser } from './IPrismicParser'
export interface IPrismicMobxConstructor {
  url: string
  token: string
  layoutNamePatterns?: string[]
  converters?: IPrismicComponentParser[]
}
