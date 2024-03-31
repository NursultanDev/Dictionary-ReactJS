import { memo, useState } from "react";
import styles from "./list.module.scss"

 const List = memo(({ definition, word, phonetic, audio, example, onDelete, bookmarkSaved, handleBookmark}) => {
 

    return (
      <li className={styles.listItem}>
        <h3 className={styles.listItem__title}>{word}</h3>
        <audio controls src={audio} className={styles.listItem__audio}></audio>

        <span className={styles.listItem__phonetic}>{phonetic}</span>
        <p className={styles.listItem__definition}>{definition}</p>
        <p className={styles.listItem__example}>{example}</p>
        
<div className={styles.listItem__btnWrapper}>
          <button onClick={() => handleBookmark()} className={
            bookmarkSaved ? styles.listItem__bookmarkActive : styles.listItem__bookmark
          }>
            <span className="material-symbols-outlined">bookmark</span>
          </button>
          <button onClick={onDelete} className={styles.listItem__btn}>
            delete
          </button>
</div>
      </li>
    );
})

export default List;