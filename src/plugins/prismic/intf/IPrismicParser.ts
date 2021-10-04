import { IKeyAny } from '../../../common/intf/IKeyAny'
export interface IPrismicComponentParser {
  component: string
  convert: PrismicComponentConverterFunction
}
export type PrismicComponentConverterFunction = (label: string, prismicElement: any) => IKeyAny | null
