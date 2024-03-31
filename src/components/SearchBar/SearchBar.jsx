import { memo, useEffect, useState } from "react";
import styles from "./searchBar.module.scss";

const SearchBar = memo(({onChange, keyWord, handleSearch, searchQuery, onSearchQueryChange}) => {

  function handleKeyDown(e) {
    if(e.code === 'Enter') {
      handleSearch();
  }
  }

    return (
        <div className={styles.searchBar}>
        <h2 className={styles.searchBar__title}>Search a word</h2>
        <div className={styles.searchBar__input_bar}>
          <input
            value={keyWord}
            onKeyDown={handleKeyDown}
            onChange={onChange}
            type="text"
            className={styles.searchBar__input}
          />
          <button  onClick={handleSearch} className={styles.searchBar__search}>
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>          
        <input type="text"
        value={searchQuery}
        onChange={onSearchQueryChange}
          className={styles.searchBar__searchItem}
          placeholder="Search a word..."
          />
      </div>
    );
})

export default SearchBar