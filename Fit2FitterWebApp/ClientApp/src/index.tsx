import 'bootstrap/dist/css/bootstrap.css';
import '@tremor/react/dist/esm/tremor.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import configureStore from './store/configureStore';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'semantic-ui-css/semantic.min.css'
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import '@tremor/react/dist/esm/tremor.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import "react-image-gallery/styles/css/image-gallery.css";

// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href') as string;
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const store = configureStore(history);

ReactDOM.render(
    <GoogleOAuthProvider clientId="825245333007-e1dvjf032ua83acmuea3nbi0doql5k4v.apps.googleusercontent.com">
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <App />
            </ConnectedRouter>
        </Provider>
    </GoogleOAuthProvider>,
    document.getElementById('root'));

registerServiceWorker();
