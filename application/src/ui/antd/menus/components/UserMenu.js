import React, {useState, useEffect, useRef, useCallback} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Menu, Modal, Progress} from 'antd';
import {UserOutlined, LogoutOutlined} from '@ant-design/icons';
import {Translation, getI18n} from 'react-i18next';

import {pathTo} from '../../Routes';
import Logger from '../../../../lib/Logger';
import Config from '../../../../Config';


const ReachableContext = React.createContext();

const UserMenu = (props) => {

  const [modal, contextHolder] = Modal.useModal();

  const logoutCountdown = Config.get('AUTO_LOGOUT_COUNTDOWN'); // seconds
  const countdownTimer = useRef();

  const [isLogoutConfirmModalVisible, setIsLogoutConfirmModalVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(logoutCountdown);

  const onLogoutClickHandler = (evt) => {
    Logger.log('debug', `UserMenu.onLogoutClickHandler()`);
    // console.log("TEST: ", evt.domEvent);
    // evt.domEvent.preventDefault();
    setTimeLeft(logoutCountdown);
    setIsLogoutConfirmModalVisible(true);
    modal.confirm({
      title: getI18n().t('confirm_alert_logout_title'),
      content:  <>
                  {getI18n().t('confirm_alert_logout_body')}
                  <ReachableContext.Consumer>
                    {timeLeft => 
                      <Progress
                        strokeColor={{
                          '0%': '#108ee9',
                          '100%': '#87d068',
                        }}
                        percent={(timeLeft / logoutCountdown) * 100}
                        showInfo={false}
                      />}
                    </ReachableContext.Consumer>
                </>,
      onOk: logout,
      onCancel: () => {
        setIsLogoutConfirmModalVisible(false);
      },
      maskClosable: false,
      okText: getI18n().t('confirm_alert_yes'),
      cancelText: getI18n().t('confirm_alert_cancel')
    });
  }

  const logout = useCallback(() => {
    Logger.log('debug', `UserMenu.logout()`);
    props.destroySession(() => props.history.push(pathTo(Config.get('DEFAULT_LOGIN_SCREEN'))));
    clearInterval(countdownTimer.current);
  }, [props]);

  useEffect(() => {
    if (isLogoutConfirmModalVisible) {
      countdownTimer.current = setInterval(() => {
        setTimeLeft(timeLeft - 0.1);
        if(timeLeft < 0) {
          logout();
        }
      }, 100);
      return () => {
        clearInterval(countdownTimer.current);
      }
    } else {
      clearInterval(countdownTimer.current);
    }
  }, [isLogoutConfirmModalVisible, timeLeft, logout]);

  return (
    <Translation>{(t) => 
      <ReachableContext.Provider value={timeLeft}>
        <Menu selectable={false} onClick={() => props.clickHandler(false)}>

          <Menu.Item key="1">
            <Link to={pathTo('UserAccountScreen')}>
              <UserOutlined />
              {t('menu_item_user_account')}
            </Link>
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item key="2" onClick={onLogoutClickHandler}>
            <LogoutOutlined />
            {t('menu_item_logout')}
          </Menu.Item>
          
        </Menu>
        {contextHolder}

      </ReachableContext.Provider>
    }</Translation>
  )
}

export default withRouter(UserMenu);
