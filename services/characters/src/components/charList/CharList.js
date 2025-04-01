import { useState, useEffect, useRef, useCallback } from 'react';
import { useAnimeResources } from '@packages/shared';
import { Spinner } from '@packages/shared';
import { ErrorMessage } from '@packages/shared';
import './charList.css';

function CharList({ onSelectedChar }) {
    const [chars, setChars] = useState([]);
    const [bufferChars, setBufferChars] = useState([]);
    const [newCharsLoading, setNewCharsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [charsListEnd, setCharsListEnd] = useState(false);
    const listItemRef = useRef([]);

    const { spinner, error, resetError, getAllCharacters } = useAnimeResources();

    useEffect(() => {
        setNewCharsLoading(true);
        fetchCharacters(page);
    }, []);

    const onFocusListItem = (i) => {
        if (listItemRef) {
            listItemRef.current[i].focus();
        }
    }

    const fetchCharacters = (page, takeCount) => {
        getAllCharacters(page)
            .then(newChars => {
                preparedData(newChars, takeCount);
                setNewCharsLoading(false);
            });
    }

    const preparedData = (newChars, takeCount = 0) => {
        if (newChars) {
            let tmpChars = newChars.slice(0, 9 - takeCount);
            setBufferChars(newChars);
            setCurrentIndex(9 - takeCount);
            setChars(prevChars => [...prevChars, ...tmpChars]);
        }
    }

    const onCharListLoaded = () => {
        resetError();
        let remaining = bufferChars.length - currentIndex;
        let takeCount = Math.min(9, remaining);
        let tmpChars = bufferChars.slice(currentIndex, currentIndex + takeCount);
        setChars(prevChars => [...prevChars, ...tmpChars]);
        setCurrentIndex(prevIndex => prevIndex + takeCount);

        if (bufferChars.length === 0) {
            setNewCharsLoading(true);
            fetchCharacters(page);
        } else if (currentIndex + takeCount >= bufferChars.length) {
            setNewCharsLoading(true);
            setPage(prevPage => prevPage + 1);
            fetchCharacters(page + 1, takeCount);
        }
    }

    const renderItems = (chars, onSelectedChar) => {
        return (
            <ul className="char-container">
                {chars.map((item, index) => {
                    const notImage = item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';

                    return (
                        <li className="char-item"
                            tabIndex={0}
                            key={item.id}
                            ref={el => listItemRef.current[index] = el}
                            onClick={() => { onSelectedChar(item.id); onFocusListItem(index) }}
                            onFocus={() => { onSelectedChar(item.id); onFocusListItem(index) }}>
                            <img src={item.thumbnail} alt="char" className="char-image" style={notImage ? { objectFit: 'fill' } : null} />
                            <div className="char-name">{item.name}</div>
                        </li>
                    );
                })}
            </ul>
        );
    }

    const renderList = renderItems(chars, onSelectedChar);
    const viewSpinner = spinner ? <Spinner /> : null;
    const viewError = error ? <ErrorMessage /> : null;

    return (
        <section className="char-list" >
            {renderList}
            {viewSpinner}
            {viewError}
            <button
                className="char-more"
                onClick={onCharListLoaded}
                disabled={newCharsLoading}
                style={charsListEnd ? { display: 'none' } : { display: 'block' }}
            >
                load more
            </button>
        </section>
    );
}

export default CharList;