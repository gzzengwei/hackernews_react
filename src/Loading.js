import React, { Component } from 'react';

const Loading = () => {
  return (
    <div>
      Loading...
      <i className='fa fa-spinner fa-spin fa-fw'/>
    </div>
  );
}

const withLoading = (Component) => ({isLoading, ...rest}) =>
  isLoading ? <Loading /> : <Component { ...rest } />

export {
  Loading,
  withLoading
}
