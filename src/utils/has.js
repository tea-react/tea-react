export default function has(obj, key) {
  return obj !== null
    && obj !== undefined
    && Object.prototype.hasOwnProperty.call(obj, key)
}
