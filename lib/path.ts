export const encodePath = (path: string): string =>
  path
    .split('/')
    .filter((k: string) => k)
    .join('%2F') // encode the '/' char for the url

export const decodePath = (path: string): string => `/${path}`
