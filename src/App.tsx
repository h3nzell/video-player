import { FC } from 'react';

import { Player } from 'components';

import styles from './App.module.scss';

const App: FC = () => (
  <div className={styles.wrapper}>
    <Player />
  </div>
);

export default App;