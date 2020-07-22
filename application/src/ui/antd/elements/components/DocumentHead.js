import React from 'react';
import {Translation} from 'react-i18next';
import {Helmet} from 'react-helmet';


export default function DocumentHead(props) {
  return (
    <Translation>{(t) =>
      <Helmet>
        <title>{props.title + ' | ' + t('app_name')}</title>
      </Helmet>
    }</Translation>
  )
}
