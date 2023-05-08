import { FC } from 'react'
import { noop } from 'lodash'
import classNames from 'classnames'

import IButtonProps from './types'
import styles from './Button.module.scss'

const Button: FC<IButtonProps> = ({
  onClick,
  children,
  className = "",
  onKeyDownHandler = noop,
}) => (
  <button
    onClick={onClick}
    onKeyDown={onKeyDownHandler}
    className={classNames(styles.button, className)}
  >
    {children}
  </button>
)

export default Button
