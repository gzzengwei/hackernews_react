import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      query: DEFAULT_QUERY,
      searchKey: '',
      isLoading: false
    };

    this.setSearchTopstories = this.setSearchTopstories.bind(this);

    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);

    this.onSearchChange = this.onSearchChange.bind(this);

    this.onSearchSubmit = this.onSearchSubmit.bind(this);
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

  render() {
    const { query, results, searchKey, isLoading } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];
    return (
      <div className="page">
        <div className="interactions">
          <Search value={query} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit} />
          { <Table list={list} pattern={query} /> }
        </div>
        <div className="interactions">
          {
            isLoading ? <Loading /> :
            <Button onClick={()=> this.fetchSearchTopstories(searchKey, page + 1)}>
              More
            </Button>
          }
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

const Table = ({ list }) =>
  <div className='table'>
  { list.map((item) =>
          <div key={item.objectID} className='table-row'>
          <span style={largeColumn}><a href={item.url}>{item.title}</a></span>
          <span style={midColumn}>{item.author}</span>
          <span style={smallColumn}>{item.points}</span>
          </div>
        ) }
  </div>

const Button = ({ onClick, children }) =>
  <button onClick={onClick} type='button'>
    {children}
  </button>

const Loading = () =>
  <div>Loading...</div>

export default App;

export {
  Button,
  Search,
  Table
}

