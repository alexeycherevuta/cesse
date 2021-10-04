import { IPrismicComponent } from './IPrismicComponent'
import { IPrismicSpan } from './IPrismicSpan'
export type IPrismicRichComponentBody = IPrismicComponent[]
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
export interface IPrismicHtmlTextComponentBody {
  tag: string
  text: string
  spans: IPrismicSpan[]
}
