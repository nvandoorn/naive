import { last } from './util'

export const encodePath = (path: string): string =>
  path
    .split('/')
    .filter((k: string) => k)
    .join('%2F') // encode the '/' char for the url

export const decodePath = (path: string): string => `/${path}`

/**
 * Split path using "/" as a delimiter
 */
export const splitPath = (path: string): string[] =>
  path.split('/').filter(k => k)

/**
 * Identify if a path is a root node
 */
export const isRootNode = (path: string): boolean => path === '/' || path === ''

/**
 * Check if path1 matches path2,
 * if not, check if its a subpath
 *
 * https://stackoverflow.com/questions/37521893/determine-if-a-path-is-subdirectory-of-another-in-node-js
 */
export const isChildOrMatch = (child: string, parent: string) => {
  if (child === parent || parent === '/') return true
  const parentTokens = parent.split('/').filter((i: string) => i.length)
  return parentTokens.every((t, i) => child.split('/')[i] === t)
}

export const getPathSuperSets = (path: string): string[] =>
  splitPath(path).reduce((acc: any[], path: string) => {
    if (!acc.length) return [`/${path}`]
    else {
      return [...acc, [last(acc), path].join('/')]
    }
  }, [])
