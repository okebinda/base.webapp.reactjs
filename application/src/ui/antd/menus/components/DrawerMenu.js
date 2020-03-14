import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Menu} from 'antd';
import {
  DashboardOutlined,
  HomeOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons';
import {Translation} from 'react-i18next';

import Config from '../../../../Config';
import {pathTo, hasRoute} from '../../Routes';
import Logger from '../../../../lib/Logger';


function DrawerMenu(props) {

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
    },
    {
      'key': '4',
      'screen': 'UserAccountScreen',
      'title': 'menu_item_user_account',
      'icon': <UserOutlined />
    }
  ];

  const logout = () => {
    Logger.log('debug', `DrawerMenu.logout()`);
    props.destroySession(() => props.history.push(pathTo(Config.get('DEFAULT_LOGIN_SCREEN'))));
  }

  return (
    <Translation>{(t) => 
      <Menu theme="light" mode="inline" selectedKeys={null} inlineIndent={0}>
        {routes.map(
          x => hasRoute(x.screen)
            ? <Menu.Item key={x.key}>
                <Link to={pathTo(x.screen)} onClick={props.toggleDrawer}>
                  {x.icon}
                  <span>{t(x.title)}</span>
                </Link>
              </Menu.Item>
            : null
          )}
        <Menu.Item key="2" onClick={logout}>
          <LogoutOutlined />
          {t('menu_item_logout')}
        </Menu.Item>
      </Menu>
    }</Translation>
  )
}

export default withRouter(DrawerMenu);

Logger.log('silly', `DrawerMenu loaded.`);
