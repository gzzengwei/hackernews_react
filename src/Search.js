import React from 'react';
import Button from './Button.js';

const Search = ({value, onChange, onSubmit, children}) =>
  <form onSubmit={onSubmit}>
    <input type="text" value={value} onChange={onChange} />
    <Button type='submit'>
      Search
    </Button>
  </form>

export default Search;
