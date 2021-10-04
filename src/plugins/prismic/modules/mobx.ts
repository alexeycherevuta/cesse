import { BaseMobxStore } from '../../../common/_base'
import { observable, action, toJS } from 'mobx'
import { computedFn } from 'mobx-utils'
const Prismic = require('prismic-javascript')
import BaseStore from '../../../client/plugins'
import RequestLifeCycles from '../../../common/props/RequestLifeCycles'
interface IPrismicPluginQueryOptions {
  lang?: string
}
export default class PrismicMobx extends BaseMobxStore {
}
