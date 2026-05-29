/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

declare module 'virtual:uno.css' {
  const content: string
  export default content
}

declare module '*.css' {
  const content: string
  export default content
}
