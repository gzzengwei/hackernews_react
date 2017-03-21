import React, { PropTypes } from 'react';
import { withLoading } from './Loading.js';

const Button = ({ onClick, className, type = 'button', children }) =>
  <button onClick={onClick} className={className} type={type}>
    {children}
  </button>

Button.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.string,
  children: PropTypes.node
};

Button.defaultProps = {
  className: ''
};

const ButtonWithLoading = withLoading(Button);


export default Button

export {
  ButtonWithLoading
}
