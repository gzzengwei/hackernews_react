import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Button from './Button.js';
import './Table.css';

class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'NONE',
      isSortReverse: false
    };
    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({sortKey, isSortReverse});
  }

  render() {
    const {
      list,
      sorts,
      onDismiss
    } = this.props;

    const {
      sortKey,
      isSortReverse
    } = this.state;

    const sortedList = sorts[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    return (
      <div className='table'>
        <div className='table-header'>
          <span style={ {width: '40%'} }>
            <Sort sortKey={'TITLE'} onSort={this.onSort} activeSortKey={sortKey}>Title</Sort>
            <span />
            <IconArrow sortKey={'TITLE'} isSortReverse={isSortReverse} activeSortKey={sortKey} />
          </span>
          <span style={ {width: '30%'} }>
            <Sort sortKey={'AUTHOR'} onSort={this.onSort} activeSortKey={sortKey}>Author</Sort>
            <IconArrow sortKey={'AUTHOR'} isSortReverse={isSortReverse} activeSortKey={sortKey} />
          </span>
          <span style={ {width: '10%'} }>
            <Sort sortKey={'COMMENTS'} onSort={this.onSort} activeSortKey={sortKey}>Comments</Sort>
            <IconArrow sortKey={'COMMENTS'} isSortReverse={isSortReverse} activeSortKey={sortKey} />
          </span>
          <span style={ {width: '10%'} }>
            <Sort sortKey={'POINTS'} onSort={this.onSort} activeSortKey={sortKey}>Points</Sort>
            <IconArrow sortKey={'POINTS'} isSortReverse={isSortReverse} activeSortKey={sortKey} />
          </span>
          <span style={ {width: '10%'} }>
            Archive
          </span>
        </div>
        {
          reverseSortedList.map((item) =>
            <div key={item.objectID} className='table-row'>
              <span className={'large-column'} ><a href={item.url}>{item.title}</a></span>
              <span className={'middle-column'} >{item.author}</span>
              <span className={'small-column'} >{item.points}</span>
            </div>
          )
        }
      </div>
    );
  }
};

Table.propTypes = {
  list: PropTypes.array.isRequired,
  onDismiss: PropTypes.func
};

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

export default Table;
