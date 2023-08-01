import {
  FC,
  useRef,
  useState,
  KeyboardEvent,
  useCallback,
  ChangeEvent,
} from "react";
import classNames from "classnames";
import { isNil } from "lodash";

import { ExpandIcon, PauseIcon, PlayIcon } from "assets";
import { secondsTimeConverterUtil } from "utils/timeConverter";
import { Button, VideoPlayer, VolumePlayer, Tooltip } from "components";

import { TVolumeState } from "./types";
import styles from "./Player.module.scss";

const initialVolume: TVolumeState = {
  value: 1,
  preValue: 0,
  isActive: false,
};

const Player: FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [tooltipTime, setTooltipTime] = useState<string>("");
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [volume, setVolume] = useState<TVolumeState>(initialVolume);
  const [currentVideoTime, setCurrentVideoTime] = useState<number>(0);
  const [currentIndicatorPosition, setCurrentIndicatorPosition] =
    useState<number>(0);

  const { value, preValue, isActive } = volume;

  const time = videoRef.current?.currentTime
    ? secondsTimeConverterUtil(
        Math.floor(Number(videoRef.current?.currentTime))
      )
    : "---";

  const duration = videoRef.current?.duration
    ? secondsTimeConverterUtil(Math.floor(Number(videoRef.current?.duration)))
    : "---";

  const onScreenModeHandler = useCallback(() => {
    isFullScreen
      ? document?.exitFullscreen()
      : containerRef.current?.requestFullscreen();
    setIsFullScreen((prev) => !prev);
  }, [isFullScreen]);

  const onToggleMuteHandler = useCallback(() => {
    if (!isNil(videoRef.current)) {
      videoRef.current.muted = !videoRef.current.muted;

      if (value !== 0) {
        setVolume({ value: 0, preValue: value, isActive: true });
      } else {
        setVolume({ value: Number(preValue), preValue: 0, isActive: true });
      }
    }
  }, [value, preValue]);

  const onTogglePlayHandler = useCallback(() => {
    const method = isPlay ? "pause" : "play";
    videoRef.current?.[method]();
    setIsPlay((prev) => !prev);
  }, [isPlay]);

  const onVideoVolumeDown = useCallback(() => {
    if (!isNil(videoRef.current) && videoRef.current.volume) {
      videoRef.current.volume = Number(
        (Number(videoRef.current.volume) - 0.05).toFixed(2)
      );
      setVolume({ value: videoRef.current.volume, isActive: true });
    }
  }, []);

  const onVideoVolumeUp = useCallback(() => {
    if (!isNil(videoRef.current) && videoRef.current.volume < 1) {
      videoRef.current.volume = Number(
        (Number(videoRef.current.volume) + 0.05).toFixed(2)
      );
      setVolume({ value: videoRef.current.volume, isActive: true });
    }
  }, []);

  const onVolumeRangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const volumeValue = e.target.value;

      setVolume((prev) => ({ ...prev, value: Number(volumeValue) / 100 }));

      if (!isNil(videoRef.current)) {
        videoRef.current.volume = Number(volumeValue) / 100;
      }
    },
    []
  );

  const onVideoForwardSkip = useCallback(() => {
    if (!isNil(videoRef.current)) videoRef.current.currentTime += 5;
  }, []);

  const onVideoBackwardSkip = useCallback(() => {
    if (!isNil(videoRef.current)) videoRef.current.currentTime -= 5;
  }, []);

  const onVideoPressHandler = (
    event: KeyboardEvent<HTMLVideoElement | HTMLDivElement>
  ) => {
    switch (event.code) {
      case "KeyM":
        onToggleMuteHandler();
        break;
      case "Space":
        onTogglePlayHandler();
        break;
      case "KeyF":
        onScreenModeHandler();
        break;
      case "ArrowUp":
        onVideoVolumeUp();
        break;
      case "ArrowRight":
        onVideoForwardSkip();
        break;
      case "ArrowLeft":
        onVideoBackwardSkip();
        break;
      case "ArrowDown":
        onVideoVolumeDown();
        break;
      default:
        break;
    }
  };

  const onVideoTimeUpdate = useCallback(() => {
    setCurrentVideoTime(
      (Number(videoRef.current?.currentTime) /
        Number(videoRef.current?.duration)) *
        100
    );
  }, []);

  const onTimelineMouseClickHandler = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = timelineRef.current?.getBoundingClientRect();
      const distanceFromTimelineStart = event.clientX - Number(rect?.left);

      const result =
        (distanceFromTimelineStart / Number(timelineRef.current?.offsetWidth)) *
        100;

      if (!isNil(videoRef.current)) {
        videoRef.current.currentTime =
          (Number(videoRef.current?.duration) * result) / 100;
      }

      setCurrentVideoTime(result);
    },
    []
  );

  const onTimelineMouseMoveHandler = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = timelineRef.current?.getBoundingClientRect();

      const distanceFromStart = event.clientX - Number(rect?.left);
      const finalDistance = Math.max(
        Math.min(distanceFromStart, Number(timelineRef.current?.offsetWidth)),
        0
      );

      const result = secondsTimeConverterUtil(
        (finalDistance / Number(timelineRef.current?.offsetWidth)) *
          Number(videoRef.current?.duration)
      );

      setTooltipTime(result);
      setCurrentIndicatorPosition(finalDistance);
    },
    []
  );

  return (
    <div
      ref={containerRef}
      className={classNames(styles.container, {
        [styles.container__full__screen]: isFullScreen,
      })}
    >
      <Button
        onClick={onTogglePlayHandler}
        className={classNames(styles.container__center__play, {
          [styles.container__center__play__active]: !isPlay,
        })}
      >
        <PlayIcon />
      </Button>
      <div className={styles.container__controllers}>
        <span className={styles.container__controllers__time}>
          {time} | {duration}
        </span>
        <div className={styles.container__controllers__bottom}>
          <Button onClick={onTogglePlayHandler}>
            {isPlay ? <PauseIcon /> : <PlayIcon />}
          </Button>

          <div
            tabIndex={0}
            ref={timelineRef}
            onKeyDown={onVideoPressHandler}
            onClick={onTimelineMouseClickHandler}
            onMouseMove={onTimelineMouseMoveHandler}
            className={styles.container__controllers__bottom__timeline}
          >
            <div
              style={{ width: currentVideoTime + "%" }}
              className={classNames(
                styles.container__controllers__bottom__timeline__filled
              )}
            />
            <div
              style={{ left: currentIndicatorPosition }}
              className={
                styles.container__controllers__bottom__timeline__indicator
              }
            >
              {/* TODO: Need to be refactor the HTML structure */}
              <Tooltip
                title={tooltipTime}
                className={
                  styles.container__controllers__bottom__timeline__indicator__tooltip
                }
              >
                <>f</>
              </Tooltip>
            </div>
          </div>
          <div className={styles.container__controllers__bottom__right}>
            <VolumePlayer
              volume={value}
              isActive={isActive}
              onToggleMuteHandler={onToggleMuteHandler}
              onVideoPressHandler={onVideoPressHandler}
              onVolumeRangeHandler={onVolumeRangeHandler}
            />
            <Button onClick={onScreenModeHandler}>
              <ExpandIcon />
            </Button>
          </div>
        </div>
      </div>
      <VideoPlayer
        volume={value}
        videoRef={videoRef}
        setVolume={setVolume}
        onVideoTimeUpdate={onVideoTimeUpdate}
        onTogglePlayHandler={onTogglePlayHandler}
        onVideoPressHandler={onVideoPressHandler}
      />
    </div>
  );
};

export default Player;
