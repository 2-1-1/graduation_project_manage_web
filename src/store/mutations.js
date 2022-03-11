export default {
  changeText (state, text) {
    state.text = text
    try {
      localStorage.text = text
    } catch (e) {}
  }
}
