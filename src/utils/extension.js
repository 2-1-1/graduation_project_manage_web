export default () => {
  function getCharacterLength (str) {
    return [...str].length
  }

  // eslint-disable-next-line no-extend-native
  Object.defineProperty(String.prototype, 'strictLength', {
    get () {
      return getCharacterLength(this)
    }
  })
}
