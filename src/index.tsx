import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ToastProvider } from 'react-toast-notifications';
import { Music } from '@features/global/components/musics/Music';
import { store } from '@redux/store';
import GlobalStyle from '@root/features/global/styles/global.styles';
import { AppRouter } from '@root/router';
import mixpanel from 'mixpanel-browser';

// Enabling the debug mode flag is useful during implementation,
// but it's recommended you remove it for production
const ROOT_ID = 'root';
mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN ?? '', { debug: true });
mixpanel.track('App initialized');

ReactDOM.render(
  <ToastProvider
    autoDismiss
    autoDismissTimeout={10000}
    placement="bottom-right"
  >
    <Provider store={store}>
      <Fragment>
        <AppRouter />
        <GlobalStyle />
        <Music />
      </Fragment>
    </Provider>
  </ToastProvider>,
  document.getElementById(ROOT_ID)
);
