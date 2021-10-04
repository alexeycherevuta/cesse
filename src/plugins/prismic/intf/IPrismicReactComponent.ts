import { IPrismicComponent } from './IPrismicComponent'
export interface IPrismicComponentProps {
  component: IPrismicComponent | undefined
}
export interface IPrismicBaseComponentProps {
  component: IPrismicComponent
}
export interface IPrismicHyperlinkComponentProps extends IPrismicBaseComponentProps {
  caption: string
}
