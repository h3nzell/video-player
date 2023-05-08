import type { FC } from 'react'
import classNames from 'classnames'

import { VolumeIcon } from 'assets'
import { Button } from 'components'

import type { TVolumePlayerProps } from './types'
import styles from './VolumePlayer.module.scss'

const VolumePlayer: FC<TVolumePlayerProps> = ({
  volume,
  isActive,
  onToggleMuteHandler,
  onVideoPressHandler,
  onVolumeRangeHandler,
}) => (
  <div className={styles.volume}>
    <div
      onClick={onToggleMuteHandler}
      className={classNames(styles.volume__tick, {
        [styles.volume__tick__muted]: volume === 0,
      })}
    />
    <input
      type='range'
      value={volume * 100}
      onChange={onVolumeRangeHandler}
      className={classNames(styles.volume__range, {
        [styles.volume__active]: isActive,
      })}
    />
    <Button
      onClick={onToggleMuteHandler}
      onKeyDownHandler={onVideoPressHandler}
    >
      <VolumeIcon />
    </Button>
  </div>
)

export default VolumePlayer
