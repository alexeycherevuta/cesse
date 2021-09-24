import * as React from 'react'
import * as _ from 'lodash'
import PrismicSpans from '../../common/props/PrismicSpans'
import { renderToString } from 'react-dom/server'
import PrismicRichContent from '../../common/props/PrismicRichContent'
import { IPrismicComponent, IPrismicHtmlTextComponentBody, IPrismicSpan } from '../../common/intf/IPrismicHelper'
import PrismicComponents from '../../common/props/PrismicComponents'
interface IPrismicSimpleText {
  slice: string
  text: string
  spans: IPrismicSpan[]
}
interface IPrismicRichText {
  slice: string
  items: IPrismicRichTextItem[]
}
interface IPrismicRichTextItem {
  type: PrismicRichContent
  text: string
  spans: IPrismicSpan[]
}
interface IPrismicImage {
  slice: string
  url: string
  dimensions: {
    width: number
    height: number
  }
  alt: string | null
  copyright: string | null
}
const Loading = (): JSX.Element => {
  return <div className="prismic--loading"><span /></div>
}
interface IPrismicRenderProps {
  component: IPrismicComponent | undefined
}
export const PrismicComponent = (props: IPrismicRenderProps): JSX.Element => {
  const { component } = props
  if (!component || !component.label) {
    return <div>Component not defined</div>
  }
  switch (component.component) {
    case PrismicComponents.HtmlTextComponent: {
      return renderHtmlTextComponent(component)
    }
    case PrismicComponents.HyperlinkComponent: {
      return <div>hyperlink</div>
    }
    case PrismicComponents.ImageComponent: {
      return <div>image</div>
    }
    case PrismicComponents.TextComponent: {
      return <div>text</div>
    }
    default: {
      return <div>unknown</div>
    }
  }
}
const renderHtmlTextComponent = (component: IPrismicComponent): JSX.Element => {
  const body = component.body as IPrismicHtmlTextComponentBody
  const text = resolveSpans(body.text, body.spans)
  return React.createElement(body.tag, {
    className: 'prismic--htmlText'
  }, [])
}
export const PrismicInline = (props: IPrismicRichText | {}): JSX.Element => {
  if (_.isEmpty(props)) {
    return <Loading />
  }
  const _props = props as IPrismicRichText
  return <div className="prismic--text prismic--rich-text" dangerouslySetInnerHTML={createMarkup(resolveRichItems(_props.items))} />
}
export const PrismicImage = (props: IPrismicImage | {}): JSX.Element => {
  if (_.isEmpty(props)) {
    return <Loading />
  }
  const _props = props as IPrismicImage
  return <img className="prismic--image" src={_props.url} alt={_props.alt || ''} />
}
export const PrismicText = (props: IPrismicSimpleText | {}): JSX.Element => {
  if (_.isEmpty(props)) {
    return <Loading />
  }
  const _props = props as IPrismicSimpleText
  return <div className="prismic--text" dangerouslySetInnerHTML={createMarkup(resolveSpans(_props.text, _props.spans))} />
}
const resolveRichItems = (items: IPrismicRichTextItem[]): any => {
  let html: string = ''
  items.forEach((item: any, index: number) => {
    html = html + resolveRichItem(items, index)
  })
  return html
}
const resolveRichItem = (items: IPrismicRichTextItem[], index: number): string => {
  const item = items[index]
  switch (item.type) {
    case PrismicRichContent.heading1:
    case PrismicRichContent.heading2:
    case PrismicRichContent.heading3:
    case PrismicRichContent.heading4: {
      return renderToString(resolveHeading(item))
    }
    case PrismicRichContent.orderedList: {
      const isNextList = getSibilingRichTextItemType(items, index + 1) === item.type
      const isPrevList = getSibilingRichTextItemType(items, index - 1) === item.type
      return resolveListItem(item, true, isPrevList, isNextList)
    }
    case PrismicRichContent.unorderedList: {
      const isNextList = getSibilingRichTextItemType(items, index + 1) === item.type
      const isPrevList = getSibilingRichTextItemType(items, index - 1) === item.type
      return resolveListItem(item, false, isPrevList, isNextList)
    }
    case PrismicRichContent.paragraph: {
      return renderToString(resolveParagraph(item))
    }
    default: {
      return resolveUnknownRichItem(item.text)
    }
  }
}
const resolveUnknownRichItem = (text: string): string => {
  return renderToString(<span className="prismic--unknown">{text}</span>)
}
const resolveParagraph = (item: IPrismicRichTextItem): JSX.Element => {
  return <p className="prismic--paragraph" dangerouslySetInnerHTML={createMarkup(resolveSpans(item.text, item.spans))} />
}
const resolveHeading = (item: IPrismicRichTextItem): JSX.Element => {
  const props = {
    className: 'prismic--header'
  }
  const level = item.type.split('heading')[1]
  const text = resolveSpans(item.text, item.spans)
  switch (level) {
    case '1': {
      return <h1 {...props}>{text}</h1>
    }
    case '2': {
      return <h2 {...props}>{text}</h2>
    }
    case '3': {
      return <h3 {...props}>{text}</h3>
    }
    default: {
      return <h4 {...props}>{text}</h4>
    }
  }
}
const resolveListItem = (item: IPrismicRichTextItem, ordered: boolean, isPrevList: boolean, isNextList: boolean): string => {
  const text = resolveSpans(item.text, item.spans)
  let listItem: string = renderToString(React.createElement('li', { className: 'prismic--list--item' }, text))
  const tag = ordered ? 'ol' : 'ul'
  if (!isPrevList) {
    listItem = `<${tag}>${listItem}`
  }
  if (!isNextList) {
    listItem = `${listItem}</${tag}>`
  }
  return listItem
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
        html = React.createElement('span', { className: 'prismic--unknown' }, [fragment])
      }
      break
    }
    case PrismicSpans.italic: {
      html = React.createElement('em', {}, [fragment])
      break
    }
    case PrismicSpans.strong: {
      html = React.createElement('strong', {}, [fragment])
      break
    }
    default: {
      html = React.createElement('span', {}, [fragment])
    }
  }
  return text.replace(fragment, renderToString(html))
}
const createMarkup = (html: string) => {
  return { __html: html }
}
const getSibilingRichTextItemType = (items: IPrismicRichTextItem[], index: number): PrismicRichContent | null => {
  return (index < items.length)
    ? items[index].type
    : null
}
