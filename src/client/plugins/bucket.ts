import { observable, action } from 'mobx'
import { IKeyAny } from '../../common/intf/IKeyAny'
import BaseStore from '.'
class AppBucket extends BaseStore {
  @observable data: IKeyAny
  @action set(key: string, value: any): void {
    this.data[key] = value
  }
}
export default AppBucket
