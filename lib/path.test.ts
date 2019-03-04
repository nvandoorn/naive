import { getPathSuperSets } from './path'

describe('path library', () => {
  test('getPathSuperSets', () => {
    expect(getPathSuperSets('/my/long/path')).toEqual([
      '/my',
      '/my/long',
      '/my/long/path'
    ])
  })
})
