import React, {Component, Suspense} from 'react';
import {Button, Drawer, Dropdown, Icon, Layout} from 'antd';
import {Translation} from 'react-i18next';

import {MainRoutes} from '../../Routes';
import MainMenu from '../../menus/components/MainMenu';
import DrawerMenu from '../../menus/containers/DrawerMenuContainer';
import UserMenu from '../../menus/containers/UserMenuContainer';
import Loading from '../../elements/components/Loading';
import Breadcrumbs from '../../elements/components/Breadcrumbs';

import '../styles/DefaultLayout.scss';

const {Header, Content, Footer, Sider} = Layout;


class DefaultLayout extends Component {

  state = {
    collapsed: false,
    drawerVisible: false
  };

  loading = () => <Loading />;

  toggle = () => {
    this.props.uiChangeMenuCollapsed();
  };

  toggleDrawer = () => {
    this.setState((prevState) => ({
      drawerVisible: !prevState.drawerVisible
    }));
  };

  render() {
    return (
      <Translation>{(t) => 
        <div className="default-layout">
          <Layout>

            <Drawer
              closable={false}
              placement="right"
              onClose={this.toggleDrawer}
              visible={this.state.drawerVisible}
            >
              <DrawerMenu toggleDrawer={this.toggleDrawer.bind(this)} />
            </Drawer>

            <Sider
              trigger={null}
              collapsible
              collapsed={this.props.isMenuCollapsed}
            >
              <div className="logo" />
              <MainMenu currentPath={this.props.location.pathname} />
            </Sider>

            <Layout>

              <Header>

                <div className="main-nav-controls">
                  <Icon
                    className="trigger"
                    type={this.props.isMenuCollapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                  />
                  <div style={{float: 'right'}}>
                    <Dropdown overlay={<UserMenu />} trigger={['hover', 'click']}>
                      <Button>
                        <Icon type="menu" />
                      </Button>
                    </Dropdown>
                  </div>
                </div>
                
                <div className="mobile-nav-controls">
                  <div style={{float: 'right'}}>
                    <Button onClick={this.toggleDrawer}>
                      <Icon
                        className="trigger-drawer"
                        type={'menu'}
                      />
                    </Button>
                  </div>
                  <h1>{t('app_name')}</h1>
                </div>

              </Header>

              <Content>
                <Breadcrumbs pathname={this.props.location.pathname} />
                <div id="content-main">
                  <Suspense fallback={this.loading()}>
                    <MainRoutes />
                  </Suspense>
                </div>
              </Content>

              <Footer>{t('copyright')}</Footer>

            </Layout>
          </Layout>
        </div>
      }</Translation>
    );
  }
}

export default DefaultLayout;
