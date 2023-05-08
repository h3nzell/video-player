import { FC, useEffect } from 'react'

import video from './player.mp4'
import { IVideoPlayerProps } from './types'
import styles from './Player.module.scss'

const VideoPlayer: FC<IVideoPlayerProps> = ({
  volume,
  videoRef,
  setVolume,
  onVideoTimeUpdate,
  onVideoPressHandler,
  onTogglePlayHandler,
}) => {
  useEffect(() => {
    const debounceVolumeTimeout = setTimeout(() => {
      setVolume((prev: any) => ({ ...prev, isActive: false }))
    }, 1000)

    return () => clearTimeout(debounceVolumeTimeout)
  }, [volume, setVolume])

  return (
    <video
      tabIndex={0}
      ref={videoRef}
      onClick={onTogglePlayHandler}
      onKeyDown={onVideoPressHandler}
      onTimeUpdate={onVideoTimeUpdate}
      className={styles.container__video}
    >
      <source src={video} type='video/mp4' />
    </video>
  )
}

export default VideoPlayer
