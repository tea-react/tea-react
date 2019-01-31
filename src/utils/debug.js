
const css = `
  color: red;
`

function warn(context) {
  return (msg) => {
    console.warn(`%cError occured at ${context}`, css)
    console.warn('%c' + msg, css)
  }
}

export default function debug(context) {
  return {
    warn: warn(context)
  }
}
