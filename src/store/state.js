let defaultText = '登录'
try {
  if (localStorage.text) {
    defaultText = localStorage.text
  }
} catch (e) {}

export default {
  text: defaultText
}
