
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './assets/styles/custom.scss';
// style
// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
// keen
import './assets/styles/keen/theme07/style.bundle.css';
import './assets/styles/keen/theme01/plugins.bundle.css';
import './assets/styles/keen/theme01/style.bundle.css';
// app custom style
import './assets/styles/app.style.scss';
import './index.css';

// redux
import { Provider } from 'react-redux';
import store from './app/store.ts';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <App />
  </Provider>
);
