import { IPrismicComponentProps, IPrismicBaseComponentProps, IPrismicHyperlinkComponentProps } from './intf/IPrismicReactComponent'
import PrismicParser from './modules/parser'
import PrismicMobxStore from './modules/mobx'
import * as rc from './modules/react'
import _PrismicSpans from './props/PrismicSpans'
import _PrismicComponents from './props/PrismicComponents'
type PrismicGenericComponentFunc = (props: IPrismicComponentProps) => JSX.Element
type PrismicBaseComponentFunc = (props: IPrismicBaseComponentProps) => JSX.Element
export const AutoPick: PrismicGenericComponentFunc = rc.PrismicComponent
export const RichText: PrismicBaseComponentFunc = rc.RichComponent
export const HtmlText: PrismicBaseComponentFunc = rc.HtmlTextComponent
export const Text: PrismicBaseComponentFunc = rc.TextComponent
export const Image: PrismicBaseComponentFunc = rc.ImageComponent
export const Hyperlink: (props: IPrismicHyperlinkComponentProps) => JSX.Element = rc.HyperlinkComponent
export const Parser = PrismicParser
export const Store = PrismicMobxStore
export { IPrismicSlices, IPrismicSlice, IPrismicContentType, IPrismicComponent } from './intf/IPrismicComponent'
export { IPrismicRichComponentBody, IPrismicTextComponentBody, IPrismicImageComponentBody, IPrismicHyperlinkComponentBody, IPrismicHtmlTextComponentBody } from './intf/IPrismicComponentBody'
export { IPrismicComponentParser, PrismicComponentConverterFunction } from './intf/IPrismicParser'
export { IPrismicComponentProps, IPrismicBaseComponentProps } from './intf/IPrismicReactComponent'
export { IPrismicSpan } from './intf/IPrismicSpan'
export { IPrismicMobxConstructor } from './intf/IPrismicMobx'
export const PrismicSpans = _PrismicSpans
export const PrismicComponents = _PrismicComponents
