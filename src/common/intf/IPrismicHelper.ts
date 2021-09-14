import { IKeyAny } from './IKeyAny'
export interface IPrismicContentType {
  id: string
  type: string
  layout: boolean
  last_publication: string
  lang: string
  slices: IPrismicSlices
  components: IPrismicComponent[]
}
export interface IPrismicComponent {
  label: string
  component: string | null
  slice: string | null
  body: IKeyAny | null
}
export interface IPrismicSlices {
  [slice: string]: IPrismicSlice
}
export interface IPrismicSlice {
  static: IPrismicComponent[]
  repeatable: IPrismicComponent[][]
}
export interface IPrismicComponentConverter {
  component: string
  convert: PrismicComponentConverterFunction
}
export type PrismicComponentConverterFunction = (prismicElement: any) => IKeyAny | null
