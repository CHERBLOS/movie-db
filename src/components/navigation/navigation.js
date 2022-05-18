import React from 'react'
import PropTypes from 'prop-types'
import { Tabs } from 'antd'

import './navigation.css'

const { TabPane } = Tabs

function Navigation(props) {
  const { setTab } = props
  return (
    <Tabs defaultActiveKey="1" onChange={(tab) => setTab(tab)} centered>
      <TabPane tab="Search" key="Search" />
      <TabPane tab="Rated" key="Rated" />
    </Tabs>
  )
}

Navigation.propTypes = {
  setTab: PropTypes.func,
}

Navigation.defaultProps = {
  setTab: () => {},
}

export default Navigation
