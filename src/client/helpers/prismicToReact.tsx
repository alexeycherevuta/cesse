import * as React from 'react'
import * as _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { renderToString } from 'react-dom/server'
import PrismicSpans from '../../common/props/PrismicSpans'
import { IPrismicComponent, IPrismicHtmlTextComponentBody, IPrismicSpan, IPrismicImageComponentBody, IPrismicTextComponentBody } from '../../common/intf/IPrismicHelper'
import PrismicComponents from '../../common/props/PrismicComponents'
interface IPrismicRenderProps {
  component: IPrismicComponent | undefined
}
export const PrismicComponent = ({ component }: IPrismicRenderProps): JSX.Element => {
  if (!component || !component.label) {
    return <div>Component not defined</div>
  }
  switch (component.component) {
    case PrismicComponents.RichComponent: {
      return RichComponent({...component})
    }
    case PrismicComponents.HtmlTextComponent: {
      return HtmlTextComponent({...component})
    }
    case PrismicComponents.HyperlinkComponent: {
      return <div>hyperlink</div>
    }
    case PrismicComponents.ImageComponent: {
      return ImageComponent({...component})
    }
    case PrismicComponents.TextComponent: {
      return TextComponent({...component})
    }
    default: {
      return <div>Component not found</div>
    }
  }
}
export const RichComponent = (props: IPrismicComponent): JSX.Element => {
  const body = props.body as IPrismicComponent[]
  let subcomponents: JSX.Element[] = []
  let genre: JSX.Element[] = []
  body.forEach((sub: IPrismicComponent) => {
    const { lastOfKind } = sub
    const subBody: any = sub.body
    if (subBody.tag === 'ol' || subBody.tag === 'ul') {
      genre.push(PrismicComponent({ component: sub }))
      if (lastOfKind) {
        const tag = subBody.tag
        subcomponents.push(React.createElement(tag, { key: uuidv4() }, genre))
        genre = []
      }
    } else {
      subcomponents.push(PrismicComponent({ component: sub }))
    }
  })
  return React.createElement('div', {
    key: uuidv4(),
    className: 'prismic--rich'
  }, subcomponents)
}
export const HtmlTextComponent = (props: IPrismicComponent): JSX.Element => {
  const body = props.body as IPrismicHtmlTextComponentBody
  let { tag } = body
  if (tag === 'ul' || tag === 'ol') {
    tag = 'li'
  }
  return React.createElement(tag, { key: uuidv4() }, <span dangerouslySetInnerHTML={createMarkup(resolveSpans(body.text, body.spans))} />
  )
}
export const ImageComponent = (props: IPrismicComponent): JSX.Element => {
  const body = props.body as IPrismicImageComponentBody
  return <img key={ uuidv4() } className="prismic--image" src={body.src} alt={body.alt || ''} />
}
export const TextComponent = (props: IPrismicComponent): JSX.Element => {
  const body = props.body as IPrismicTextComponentBody
  return <span key={ uuidv4() } className="prismic--text">{body.text}</span>
}
const resolveSpans = (text: string, spans: IPrismicSpan[]): string => {
  let _text = text
  spans.forEach((span: IPrismicSpan) => {
    const fragment = _text.substring(span.start, span.end)
    text = resolveSpan(text, fragment, span)
  })
  return text
}
const resolveSpan = (text: string, fragment: string, span: IPrismicSpan): string => {
  let html: JSX.Element
  switch (span.type) {
    case PrismicSpans.hyperlink: {
      if (span.data) {
        const toId = span.data.url.indexOf('#') !== -1
        const url = toId
          ? span.data.url.split('
          : span.data.url
        html = React.createElement('a', {
          className: 'prismic--link',
          href: url,
          target: toId ? '' : '_blank'
        }, [fragment])
      } else {
        html = React.createElement('span', { key: uuidv4(), className: 'prismic--unknown' }, [fragment])
      }
      break
    }
    case PrismicSpans.italic: {
      html = React.createElement('em', { key: uuidv4() }, [fragment])
      break
    }
    case PrismicSpans.strong: {
      html = React.createElement('strong', { key: uuidv4() }, [fragment])
      break
    }
    default: {
      html = React.createElement('span', { key: uuidv4() }, [fragment])
    }
  }
  return text.replace(fragment, renderToString(html))
}
const createMarkup = (text: string) => {
  return {__html: text}
}
