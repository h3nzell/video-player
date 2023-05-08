import ReactDOM from 'react-dom/client';

import App from './App';
import './styles/index.global.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);