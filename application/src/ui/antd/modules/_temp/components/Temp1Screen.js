import React, {Component} from 'react';
import {Translation} from 'react-i18next';
import {Card, Col, Row} from 'antd';

import DocumentHead from '../../../elements/components/DocumentHead';
import Logger from '../../../../../lib/Logger';


class Temp1Screen extends Component {
  render() {
    return (
      <Translation>{(t) => 
        <div>

          <DocumentHead title="Temp 1" />
          
          <Row>
            <Col span={24}>
              <Card title="Temp 1">
                Temp 1
              </Card>
            </Col>
          </Row>

        </div>
      }</Translation>
    )
  }

  /* LIFECYCLE EVENTS */

  componentDidMount() {
    Logger.log('silly', `Temp1Screen.componentDidMount()`);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }

  componentDidUpdate() {
    Logger.log('silly', `Temp1Screen.componentDidUpdate()`);
  }

  componentWillUnmount() {
    Logger.log('silly', `Temp1Screen.componentWillUnmount()`);
  }
}

export default Temp1Screen;

Logger.log('silly', `Temp1Screen loaded.`);
