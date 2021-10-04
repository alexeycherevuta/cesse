import PrismicSpans from '../props/PrismicSpans'
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
