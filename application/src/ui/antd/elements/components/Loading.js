import React from 'react';
import {Translation} from 'react-i18next';
import {Spin} from 'antd';


export default function Loading(props) {
  return (
    <Translation>{(t) =>
      <div style={{height: '100%', minHeight: '100%', display: 'flex'}}>
        <div style={{display: 'flex', flex: 1}}>
          <div style={{margin: 'auto'}}>
            <Spin size="large" style={{marginRight: '12px'}} />
            {t('feedback_loading')}
          </div>
        </div>
      </div>
    }</Translation>
  )
}
