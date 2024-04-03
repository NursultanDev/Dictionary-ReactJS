import { useState, useEffect, useMemo } from "react";
import List from "../List/List";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./dictionary.module.scss";

export default function Dictionary() {
  //for popup
  const[popupState, setPopupState] = useState(false);
  //for list Item deleting state
  const[listItemState, setListItemState] = useState(false);
  //search query for searching in the list
  const [searchQuery, setSearchQuery] = useState("");
  //key word for fetch the data
  const [keyWord, setKeyWord] = useState("");
  //for bookmark
  const [bookmarkSaved, setBookmarkSaved] = useState(false);
  //for tab
  const [toggleTab, setToggleTab] = useState(1);
  //word array
  //TODO rename to words:
  const [word, setWord] = useState(() => {
    // Load tasks from localStorage on component mount
    const savedTodos = localStorage.getItem("words");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const savedTodos = localStorage.getItem("words");
  const api = "https://api.dictionaryapi.dev/api/v2/entries/en/";

  useEffect(() => {
    localStorage.setItem("words", JSON.stringify(word));
  }, [word]);

  useEffect(() => {
    return () => {
      localStorage.setItem("words", JSON.stringify(word));
    };
  }, []);

  useEffect(() =>{
    console.log(`popupState ${popupState}`);
  }, [popupState]);
  useEffect(() =>{
    console.log(`listItemState ${listItemState}`);
  }, [popupState]);

  function fetchWord() {
    const res = `${api}${keyWord}`;
    return fetch(res);
  }

  //we fetch data from out server and if response.ok we put our object to Word array.
  async function handleSearch() {
    if (keyWord === "") {
      alert("write the word, sucker!");
    } else {
      const response = await fetchWord();
      if (response.ok) {
        const data = await response.json();
        const dataFirstObj = data[0];

        //added new element - id
        dataFirstObj.id = crypto.randomUUID();
        //added new element - bookmark
        dataFirstObj.bookmark = false;
        setWord((prevWords) => [...prevWords, dataFirstObj]);
      } else {
        alert("Write an existing word in english, sucker!");
      }

      setKeyWord("");
    }
  }

  function onDelete(id) {
    if(confirm("ARE YOU SURE MAN?")) {
      setWord((prevWords) => {
        return prevWords.filter((word) => word.id !== id);
  
      });
    }
  }

  const memoizedWordList = useMemo(() => word, [word]);

  function handleBookmark(id) {
    setWord((prevWords) =>
      prevWords.map((word) => {
        return word.id === id ? { ...word, bookmark: !word.bookmark } : word;
      })
    );
  }

  //why if(index === 1) set 1? cuz IDK
  function handleTabToggle(index) {
    if(index === 1) {
      setToggleTab(1);
    }
    if(index === 2) {
      setToggleTab(2)
    }
  }

  return (
    <div className={styles.wrapper} >
      <SearchBar
        onChange={(e) => setKeyWord(e.target.value)}
        keyWord={keyWord}
        handleSearch={handleSearch}
        searchQuery={searchQuery}
        onSearchQueryChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className={styles.tabs} >
        <div
          className={
            toggleTab === 1 ? styles.tabs__item_active : styles.tabs__item
          }
          onClick={() => handleTabToggle(1)}
        >
          Find
        </div>
        <div
          className={
            toggleTab === 2 ? styles.tabs__item_active : styles.tabs__item
          }
          onClick={() => handleTabToggle(2)}
        >
          Saved{" "}
        </div>
      </div>
      <div className={styles.tabs__body}>
        <div
          className={
            toggleTab === 1
              ? styles.tabs__body_item_active
              : styles.tabs__body_item
          }
        >
          <ul className={styles.list}>
            {memoizedWordList
              .filter((thisWord) => {
                return searchQuery.toLowerCase() === ""
                  ? thisWord
                  : thisWord?.word.toLowerCase().includes(searchQuery);
              })
              .map((thisWord) => {
                return (
                  <List
                    key={thisWord.id}
                    definition={
                      thisWord?.meanings[0]?.definitions[0]?.definition
                    }
                    word={thisWord?.word}
                    phonetic={thisWord?.phonetic}
                    audio={thisWord?.phonetics[0]?.audio}
                    example={thisWord?.meanings[0]?.definitions[0]?.example}
                    onDelete={() => onDelete(thisWord.id)}
                    handleBookmark={() => handleBookmark(thisWord.id)}
                    bookmarkSaved={thisWord.bookmark}
                  />
                );
              })}
          </ul>
        </div>
        <div
          className={
            toggleTab === 2
              ? styles.tabs__body_item_active
              : styles.tabs__body_item
          }
        >
          <ul className={styles.list}>
            {memoizedWordList
              .filter((thisWord) => {
                return searchQuery.toLowerCase() === ""
                  ? thisWord
                  : thisWord?.word.toLowerCase().includes(searchQuery);
              })
              //filtering words with bookmark === true
              .filter((thisWord) => thisWord.bookmark === true)
              .map((thisWord) => {
                return(
                  <List
                key={thisWord.id}
                definition={
                  thisWord?.meanings[0]?.definitions[0]?.definition
                }
                word={thisWord?.word}
                phonetic={thisWord?.phonetic}
                audio={thisWord?.phonetics[0]?.audio}
                example={thisWord?.meanings[0]?.definitions[0]?.example}
                onDelete={() => onDelete(thisWord.id)}
                handleBookmark={() => handleBookmark(thisWord.id)}
                bookmarkSaved={thisWord.bookmark}
              />
                );
              })
              }
          </ul>
        </div>
      </div>
    </div>
  );
}
