import React from 'react';
import {Link} from 'react-router-dom';
import {Menu} from 'antd';
import {DashboardOutlined, HomeOutlined, SettingOutlined} from '@ant-design/icons';
import {Translation} from 'react-i18next';

import {pathTo, hasRoute, getRouteFromPath} from '../../Routes';
import Logger from '../../../../lib/Logger';


function MainMenu(props) {

  const routes = [
    {
      'key': '1',
      'screen': 'DashboardScreen',
      'title': 'menu_item_dashboard',
      'icon': <DashboardOutlined />
    },
    {
      'key': '2',
      'screen': 'Temp1Screen',
      'title': 'Temp 1',
      'icon': <HomeOutlined />
    },
    {
      'key': '3',
      'screen': 'Temp2Screen',
      'title': 'Temp 2',
      'icon': <SettingOutlined />
    }
  ];

  const currentRoute = getRouteFromPath(props.currentPath);
  const currentMenuItem = currentRoute ? routes.filter(x => x.screen === currentRoute.screen) : null;
  const defaultSelectedKey = currentMenuItem && currentMenuItem.length ? currentMenuItem[0].key : null;

  return (
    <Translation>{(t) => 
      <Menu theme="dark" mode="inline" selectedKeys={[defaultSelectedKey]}>
        {routes.map(
          x => hasRoute(x.screen)
            ? <Menu.Item key={x.key}>
                <Link to={pathTo(x.screen)}>
                  {x.icon}
                  <span>{t(x.title)}</span>
                </Link>
              </Menu.Item>
            : null
          )}
      </Menu>
    }</Translation>
  )
}

export default MainMenu;

Logger.log('silly', `MainMenu loaded.`);
