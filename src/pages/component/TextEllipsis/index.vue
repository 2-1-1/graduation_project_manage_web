<script>
export default {
  name: 'TextEllipsis',
  props: {
    text: '',
    length: 0,
    children: 'children'
  },
  render () {
    return (
      <div>
      {typeof this.text === 'string' && this.text.length > this.length ? (
        <el-tooltip effect="dark" content={this.text}>
        <span>{this.text.substr(0, this.length) + '...'}</span>
        </el-tooltip>
      ) : (
        this.text
      )}
      </div>
    )
  }
}
</script>
