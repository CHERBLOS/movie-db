import React from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'

import './searchLine.css'

function SearchLine(props) {
  const { setSearchString, inputRef } = props

  const onChange = (e) => {
    setSearchString(e.target.value.trim())
  }

  const delayedOnLabelChange = debounce((e) => onChange(e), 1200)
  return (
    <div className="search">
      <input ref={inputRef} className="search__line" placeholder="Type to search..." onChange={delayedOnLabelChange} />
    </div>
  )
}

SearchLine.propTypes = {
  setSearchString: PropTypes.func,
  inputRef: PropTypes.objectOf(PropTypes.shape),
}

SearchLine.defaultProps = {
  setSearchString: () => {},
  inputRef: {},
}

export default SearchLine
