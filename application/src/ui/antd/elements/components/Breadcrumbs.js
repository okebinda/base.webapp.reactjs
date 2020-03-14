import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Breadcrumb} from 'antd';

import Logger from '../../../../lib/Logger';
import {routes, getRouteFromPath, pathTo} from '../../Routes';


class Breadcrumbs extends Component {

  getPath = () => {
    let items = [];
    let pathStack = this.props.pathname.split('/');
    while (pathStack.length > 1 ) {
      const path = pathStack.join("/");
      const rt = getRouteFromPath(path, routes);
      let i = 0;
      if (rt && rt.route && (!items[items.length-1] || items[items.length-1].title !== rt.route[4])) {
        items.push({
          key: i++,
          title: rt.route[4],
          path: path
        });
      }
      pathStack.pop();
    }
    return items;
  }

  setBreadcrumbs = () => {
    this.setState({
      breadcrumb: this.getBreadcrumb(),
    })
  }

  getBreadcrumb = () => {
    const [activeMenuItem, ...path] = this.getPath();

    if (activeMenuItem && path.length) {
      return path.reverse().map((item, index) => {
        if (index === path.length - 1) {
          return (
            <>
              <Breadcrumb.Item>
                <Link to={item.path}>
                  {item.title}
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{activeMenuItem.title}</Breadcrumb.Item>
            </>
          )
        }
        return (
          <Breadcrumb.Item>
            <Link key={item.key} to={item.path}>
              {item.title}
            </Link>
          </Breadcrumb.Item>
        )
      })
    }
    if (!activeMenuItem) {
      return
    }
    return (
      <Breadcrumb.Item>{activeMenuItem.title}</Breadcrumb.Item>
    )
  }

  render() {
    const breadcrumb = this.getBreadcrumb();
    return (
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={pathTo('DashboardScreen')}>Home</Link>
        </Breadcrumb.Item>
        {breadcrumb}
      </Breadcrumb>
    )
  }

  /* LIFECYCLE EVENTS */

  componentDidMount() {
    Logger.log('silly', `Breadcrumbs.componentDidMount()`);
  }

  componentDidUpdate() {
    Logger.log('silly', `Breadcrumbs.componentDidUpdate()`);
  }

  componentWillUnmount() {
    Logger.log('silly', `Breadcrumbs.componentWillUnmount()`);
  }
}

export default Breadcrumbs;

Logger.log('silly', `Breadcrumbs loaded.`);
