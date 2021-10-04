import { IKeyAny } from '../../../common/intf/IKeyAny'
export interface IPrismicSlices {
  [slice: string]: IPrismicSlice
}
export interface IPrismicSlice {
  static: IPrismicComponent[]
  repeatable: IPrismicComponent[][]
}
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
