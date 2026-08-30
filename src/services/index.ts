import { instance } from './instance'
import { errorInterceptor } from './interceptors'

errorInterceptor(instance)

export { instance }
