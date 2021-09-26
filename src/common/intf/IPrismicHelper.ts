import { IKeyAny } from './IKeyAny'
import PrismicSpans from '../props/PrismicSpans'
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
  firstOfKind: boolean
  lastOfKind: boolean
  body: IKeyAny | IPrismicComponent[] | null
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
interface IPrismicSpanHyperlink {
  link_type: 'Web'
  url: string
}
export interface IPrismicSpan {
  start: number
  end: number
  type: PrismicSpans
  data?: IPrismicSpanHyperlink
}
export type PrismicComponentConverterFunction = (label: string, prismicElement: any) => IKeyAny | null
export interface IPrismicHtmlTextComponentBody {
  tag: string
  text: string
  spans: IPrismicSpan[]
}
export type IPrismicComplexComponentBody = IPrismicComponent[]
export interface IPrismicTextComponentBody {
  text: string
}
export interface IPrismicImageComponentBody {
  src: string
  alt: string
  dimensions: {
    width: number
    height: number
  }
  copyright: string | undefined
}
export interface IPrismicHyperlinkComponentBody {
  type: string
  href: string
  target: string | undefined
}
