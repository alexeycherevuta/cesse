import * as _ from 'lodash'
import { IPrismicHtmlTextComponentBody, IPrismicTextComponentBody, IPrismicImageComponentBody, IPrismicHyperlinkComponentBody } from '../intf/IPrismicComponentBody'
export const parseHtmlTextComponent = (label: string, el: any): IPrismicHtmlTextComponentBody | null => {
  const nameToTag = {
    heading1: 'h1',
    heading2: 'h2',
    heading3: 'h3',
    heading4: 'h4',
    heading5: 'h5',
    heading6: 'h6',
    paragraph: 'p',
    o_list_item: 'ol',
    list_item: 'ul'
  }
  const type = el && el.type
    ? el.type.replace(/-/g, '_')
    : undefined
  if (type && el.text && Array.isArray(el.spans) && Object.keys(nameToTag).includes(type)) {
    return {
      tag: nameToTag[type],
      text: el.text,
      spans: el.spans
    }
  }
  return null
}
export const parseTextComponent = (label: string, el: any): IPrismicTextComponentBody | null => {
  if (_.isString(el) || _.isNull(el)) {
    return {
      text: el || ''
    }
  }
  return null
}
export const parseImageComponent = (label: string, el: any): IPrismicImageComponentBody | null => {
  if (el && el.hasOwnProperty('dimensions') && el.hasOwnProperty('alt') && el.hasOwnProperty('url')) {
    return {
      src: el.url,
      alt: el.alt || '',
      dimensions: el.dimensions,
      copyright: el.copyright || undefined
    }
  }
  return null
}
export const parseHyperlinkComponent = (label: string, el: any): IPrismicHyperlinkComponentBody | null => {
  if (el && el.hasOwnProperty('link_type') && el.hasOwnProperty('url')) {
    return {
      type: el.link_type.toLowerCase(),
      href: el.url,
      target: el.target || undefined
    }
  }
  return null
}
