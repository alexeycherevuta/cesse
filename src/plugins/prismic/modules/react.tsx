import * as React from 'react'
import * as _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { renderToString } from 'react-dom/server'
import PrismicSpans from '../props/PrismicSpans'
import PrismicComponents from '../props/PrismicComponents'
import { IPrismicSpan } from '../intf/IPrismicSpan'
import { IPrismicComponent } from '../intf/IPrismicComponent'
import { IPrismicComponentProps, IPrismicBaseComponentProps, IPrismicHyperlinkComponentProps } from '../intf/IPrismicReactComponent'
import { IPrismicImageComponentBody, IPrismicHtmlTextComponentBody, IPrismicTextComponentBody, IPrismicHyperlinkComponentBody } from '../intf/IPrismicComponentBody'
export const urlReplacer = (input: string): string => {
  const toRelative = input.indexOf('https:
  const toId = input.indexOf('
  return toRelative
    ? input.replace('https:
    : toId
      ? input.replace('https:
      : input
}
export const PrismicComponent = ({ component }: IPrismicComponentProps): JSX.Element => {
  if (!component || _.isNull(component.component) || !component.label) {
    return <div>Error: component is `null`</div>
  }
  switch (component.component) {
    case PrismicComponents.RichComponent: {
      return RichComponent({component})
    }
    case PrismicComponents.HtmlTextComponent: {
      return HtmlTextComponent({component})
    }
    case PrismicComponents.HyperlinkComponent: {
      return HyperlinkComponent({
        component,
        caption: ''
      })
    }
    case PrismicComponents.ImageComponent: {
      return ImageComponent({component})
    }
    case PrismicComponents.TextComponent: {
      return TextComponent({component})
    }
    default: {
      return <div>Error: component not recognised</div>
    }
  }
}
export const RichComponent = (props: IPrismicBaseComponentProps): JSX.Element => {
  const body = props.component.body as IPrismicComponent[]
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
export const HtmlTextComponent = (props: IPrismicBaseComponentProps): JSX.Element => {
  const body = props.component.body as IPrismicHtmlTextComponentBody
  let tag = (body && body.tag)
    ? body.tag
    : 'span'
  if (body && (body.tag === 'ul' || body.tag === 'ol')) {
    tag = 'li'
  }
  return React.createElement(tag, { key: uuidv4() }, <span dangerouslySetInnerHTML={createMarkup(resolveSpans(body.text, body.spans))} />
  )
}
export const ImageComponent = (props: IPrismicBaseComponentProps): JSX.Element => {
  const body = props.component.body as IPrismicImageComponentBody
  return <img key={ uuidv4() } className="prismic--image" src={body.src} alt={body.alt || ''} />
}
export const TextComponent = (props: IPrismicBaseComponentProps): JSX.Element => {
  const body = props.component.body as IPrismicTextComponentBody
  return <span key={ uuidv4() } className="prismic--text">{body.text}</span>
}
export const HyperlinkComponent = (props: IPrismicHyperlinkComponentProps): JSX.Element => {
  const body = props.component.body as IPrismicHyperlinkComponentBody
  const href = urlReplacer(body.href)
  return <a key={uuidv4()} href={href} className="prismic--link" target={body.target || '_self'}>{props.caption}</a>
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
        const toId = span.data.url.indexOf('
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
