import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Menu, Modal} from 'antd';
import {Icon as LegacyIcon} from '@ant-design/compatible';
import {Translation, getI18n} from 'react-i18next';

import {pathTo} from '../../Routes';
import Logger from '../../../../lib/Logger';
import Config from '../../../../Config';


const {confirm} = Modal;

class UserMenu extends Component {

  onLogoutClickHandler = () => {
    Logger.log('debug', `UserMenu.onLogoutClickHandler()`);
    confirm({
      title: getI18n().t('confirm_alert_logout_title'),
      content: getI18n().t('confirm_alert_logout_body'),
      onOk: this.logout,
      okText: getI18n().t('confirm_alert_yes'),
      cancelText: getI18n().t('confirm_alert_cancel')
    });
  }

  logout = () => {
    Logger.log('debug', `UserMenu.logout()`);
    this.props.destroySession(() => this.props.history.push(pathTo(Config.get('DEFAULT_LOGIN_SCREEN'))));
  }

  render() {
    return (
      <Translation>{(t) => 
        <Menu>

          <Menu.Item key="1">
            <Link to={pathTo('UserAccountScreen')}>
              <LegacyIcon type="user" />
              {t('menu_item_user_account')}
            </Link>
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item key="2" onClick={this.onLogoutClickHandler}>
            <LegacyIcon type="logout" />
            {t('menu_item_logout')}
          </Menu.Item>
          
        </Menu>
      }</Translation>
    )
  }
}

export default withRouter(UserMenu);
