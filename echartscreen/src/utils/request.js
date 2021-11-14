import axios from 'axios'
import { baseUrl } from '@/config'
// create an axios instance
const service = axios.create({
  baseURL: baseUrl, // url = base url + request url
  timeout: 5000 // request timeout
})

export default service
