import * as rc from './modules/react'
import { IPrismicComponentProps, IPrismicBaseComponentProps, IPrismicHyperlinkComponentProps } from './intf/IPrismicReactComponent'
type PrismicGenericComponentFunc = (props: IPrismicComponentProps) => JSX.Element
type PrismicBaseComponentFunc = (props: IPrismicBaseComponentProps) => JSX.Element
export const Component: PrismicGenericComponentFunc = rc.PrismicComponent
export const RichText: PrismicBaseComponentFunc = rc.RichComponent
export const HtmlText: PrismicBaseComponentFunc = rc.HtmlTextComponent
export const Text: PrismicBaseComponentFunc = rc.TextComponent
export const Image: PrismicBaseComponentFunc = rc.ImageComponent
export const Hyperlink: (props: IPrismicHyperlinkComponentProps) => JSX.Element = rc.HyperlinkComponent
