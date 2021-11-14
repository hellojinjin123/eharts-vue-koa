import request from '@/utils/request'

export function getSeller() {
  return request({
    url: '/seller.json',
    method: 'get'
  })
}

export function getRank() {
  return request({
    url: '/rank.json',
    method: 'get'
  })
}