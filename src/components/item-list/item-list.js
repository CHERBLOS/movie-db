import React from 'react'
import PropTypes from 'prop-types'
import { List, Alert } from 'antd'

import Item from '../item'
import './item-list.css'

function ItemList(props) {
  const { films, guestSessionId } = props
  const list = films.length ? (
    <List
      className="list"
      grid={{ gutter: 16, column: 2 }}
      dataSource={films}
      renderItem={(item) => (
        <List.Item className="list__item">
          <Item
            key={item.id}
            id={item.id}
            title={item.title}
            guestSessionId={guestSessionId}
            date={item.date}
            genresArr={item.genres}
            overview={item.overview}
            img={item.img}
            averageRate={item.rate}
            rating={item.rating}
          />
        </List.Item>
      )}
    />
  ) : (
    <Alert message="I didn't search films for your request. Try again!" banner />
  )
  return <div>{list}</div>
}

ItemList.propTypes = {
  films: PropTypes.arrayOf(PropTypes.shape),
  guestSessionId: PropTypes.string,
}

ItemList.defaultProps = {
  films: {},
  guestSessionId: '',
}

export default ItemList
