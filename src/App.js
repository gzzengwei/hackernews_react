import React, { Component } from 'react';
import logo from './logo.svg';
import { sortBy } from 'lodash';
import classNames from 'classnames';
import './App.css';
import 'font-awesome/css/font-awesome.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = 100;
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const list = [
  {
    title: 'React by Wei',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  }
];

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse()
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      query: DEFAULT_QUERY,
      searchKey: '',
      isLoading: false,
      sortKey: 'NONE',
      isSortReverse: false
    };

    this.setSearchTopstories = this.setSearchTopstories.bind(this);

    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);

    this.onSearchChange = this.onSearchChange.bind(this);

    this.onSearchSubmit = this.onSearchSubmit.bind(this);

    this.onSort = this.onSort.bind(this);
  }

  setSearchTopstories(result) {
    const { hits, page } = result;
    const { searchKey } = this.state;
    const oldHits = page === 0 ? [] : this.state.results[searchKey].hits;
    const updateHits = [...oldHits, ...hits];
    this.setState({
      results: { ...this.state.results, [searchKey]: { hits: updateHits, page } },
      isLoading: false
    });
  }

  fetchSearchTopstories(query, page) {
    this.setState({ isLoading: true });
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${query}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then((response) => response.json())
      .then((result) => this.setSearchTopstories(result));
  }

  componentDidMount() {
    const { query } = this.state;
    this.setState({ searchKey: query });
    this.fetchSearchTopstories(query, DEFAULT_PAGE);
  }

  onSearchChange(event) {
    this.setState({query: event.target.value});
  }

  onSearchSubmit(event) {
    const { query } = this.state;
    this.setState({ searchKey: query });
    this.fetchSearchTopstories(query, DEFAULT_PAGE);
    event.preventDefault();
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({sortKey, isSortReverse});
  }

  render() {
    const { query, results, searchKey, isLoading, sortKey, isSortReverse } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];
    return (
      <div className="page">
        <div className="interactions">
          <Search value={query} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit} />
          { <Table list={list} sortKey={sortKey} onSort={this.onSort} onDismiss={this.onDismiss} pattern={query} isSortReverse={isSortReverse} /> }
        </div>
        <div className="interactions">
          <ButtonWithLoading isLoading={isLoading} onClick={()=> this.fetchSearchTopstories(searchKey, page + 1)}>
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

const isSearched = (query) => (item) => !query || item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;

const Search = ({value, onChange, onSubmit, children}) =>
  <form onSubmit={onSubmit}>
    <input type="text" value={value} onChange={onChange} />
    <button type='submit'>{children}</button>
  </form>

const largeColumn = { width: '40%' }
const midColumn = { width: '30%' }
const smallColumn = { width: '15%' }

const Table = ({ list, sortKey, onSort, onDismiss, isSortReverse }) => {
  const sortedList = SORTS[sortKey](list);
  const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList
  return (
    <div className='table'>
      <div className='table-header'>
        <span style={ {width: '40%'} }>
          <Sort sortKey={'TITLE'} onSort={onSort} activeSortKey={sortKey}>Title</Sort>
          <span />
          <IconArrow sortKey={'TITLE'} isSortReverse={isSortReverse} activeSortKey={sortKey} />
        </span>
        <span style={ {width: '30%'} }>
          <Sort sortKey={'AUTHOR'} onSort={onSort} activeSortKey={sortKey}>Author</Sort>
          <IconArrow sortKey={'AUTHOR'} isSortReverse={isSortReverse} activeSortKey={sortKey} />
        </span>
        <span style={ {width: '10%'} }>
          <Sort sortKey={'COMMENTS'} onSort={onSort} activeSortKey={sortKey}>Comments</Sort>
          <IconArrow sortKey={'COMMENTS'} isSortReverse={isSortReverse} activeSortKey={sortKey} />
        </span>
        <span style={ {width: '10%'} }>
          <Sort sortKey={'POINTS'} onSort={onSort} activeSortKey={sortKey}>Points</Sort>
          <IconArrow sortKey={'POINTS'} isSortReverse={isSortReverse} activeSortKey={sortKey} />
        </span>
        <span style={ {width: '10%'} }>
          Archive
        </span>
      </div>
      {
        reverseSortedList.map((item) =>
          <div key={item.objectID} className='table-row'>
          <span style={largeColumn}><a href={item.url}>{item.title}</a></span>
          <span style={midColumn}>{item.author}</span>
          <span style={smallColumn}>{item.points}</span>
          </div>
        )
      }
    </div>
  )
 }

const Button = ({ onClick, className, children }) =>
  <button onClick={onClick} className={className} type='button'>
    {children}
  </button>


const Sort = ({sortKey, onSort, activeSortKey, children}) => {
  const sortClass = classNames('button-inline', {'button-active': sortKey === activeSortKey});
  return (
    <Button onClick={() => onSort(sortKey)} className={sortClass}>
      {children}
    </Button>
  )
};

const IconArrow = ({sortKey, activeSortKey, isSortReverse}) => {
  const iconActive = sortKey === activeSortKey;
  const iconClass = classNames('fa', 'fa-fw', {'fa-chevron-up': iconActive && isSortReverse, 'fa-chevron-down': iconActive && !isSortReverse  });
  return (
    <i className={iconClass} />
  );
};

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

const ButtonWithLoading = withLoading(Button);

export default App;

export {
  Button,
  Search,
  Table
}

