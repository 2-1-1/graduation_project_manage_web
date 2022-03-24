const transform = (value, option, key = 'value') => {
  if (!(option && option.length)) {
    return '-'
  }
  return option.filter(item => item[key] === value)[0] ? option.filter(item => item[key] === value)[0].label : '-'
}

export default transform
