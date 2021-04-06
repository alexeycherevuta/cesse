import RequestLifeCycles from '../../common/props/RequestLifeCycles'
import { IBaseRequest } from '../intf/IBase'
import { AxiosResponse, AxiosError } from 'axios'
const RequestHelper = (lifeCycle: RequestLifeCycles, r?: AxiosResponse | AxiosError): IBaseRequest => {
  let base: IBaseRequest = {
    lifeCycle,
    status: null,
    statusText: null,
    headers: null,
    data: {}
  }
  if (r && !r.hasOwnProperty('isAxiosError') && r.hasOwnProperty('data')) {
    const response = r as AxiosResponse
    base = {
      lifeCycle,
      status: response.data.status,
      statusText: response.data.statusText,
      headers: response.data.headers,
      data: response.data.data
    }
    if (response.data.data && response.data.data.message) {
      base.message = response.data.data.message
    }
  } else if (r) {
    const response = r as AxiosError
    base = {
      lifeCycle,
      status: 500,
      statusText: 'error',
      message: 'axios-error',
      headers: null,
      data: {
        message: response.message
      }
    }
  }
  return base
}
export default RequestHelper
