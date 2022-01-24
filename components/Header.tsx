import React from 'react'
import { Menu } from 'semantic-ui-react'

export const Header: React.FC = () => {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Menu.Item>CrowdCoin</Menu.Item>

      <Menu.Menu position="right">
        <Menu.Item>Campaigns</Menu.Item>

        <Menu.Item>+</Menu.Item>
      </Menu.Menu>
    </Menu>
  )
}
