import React, {Component} from 'react';
import {Translation} from 'react-i18next';
import {Card, Col, Row} from 'antd';

import DocumentHead from '../../../elements/components/DocumentHead';
import Logger from '../../../../../lib/Logger';


class Temp2Screen extends Component {
  render() {
    return (
      <Translation>{(t) => 
        <div>

          <DocumentHead title="Temp 2" />
          
          <Row>
            <Col span={24}>
              <Card title="Temp 2">
                Temp 2
              </Card>
            </Col>
          </Row>

        </div>
      }</Translation>
    )
  }

  /* LIFECYCLE EVENTS */

  componentDidMount() {
    Logger.log('silly', `Temp2Screen.componentDidMount()`);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }

  componentDidUpdate() {
    Logger.log('silly', `Temp2Screen.componentDidUpdate()`);
  }

  componentWillUnmount() {
    Logger.log('silly', `Temp2Screen.componentWillUnmount()`);
  }
}

export default Temp2Screen;

Logger.log('silly', `Temp2Screen loaded.`);
