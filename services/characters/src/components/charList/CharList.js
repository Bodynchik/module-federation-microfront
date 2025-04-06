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
    // const [charsListEnd, setCharsListEnd] = useState(false);
    const listItemRef = useRef([]);

    const { spinner, error, resetError, getAllCharacters } = useAnimeResources();

    useEffect(() => {
        fetchCharacters(page);
    }, []);

    const onFocusListItem = (i) => {
        if (listItemRef) {
            listItemRef.current[i].focus();
        }
    }

    const fetchCharacters = (page, takeCount) => {
        setNewCharsLoading(false);
        getAllCharacters(page)
            .then(newChars => {
                preparedData(newChars, takeCount);
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

    const onCharListLoaded = async () => {
        resetError();
        setNewCharsLoading(true);
        const takeCount = Math.min(9, bufferChars.length - currentIndex);
        let tmpChars = bufferChars.slice(currentIndex, currentIndex + takeCount);
        let tmpCurrentBuffer = [...bufferChars];
        let tmpCurrentIndex = currentIndex;
        tmpCurrentIndex += takeCount;

        if (bufferChars.length === 0) {
            fetchCharacters(page);
        } else if (tmpCurrentIndex >= bufferChars.length) {
            const res = await getAllCharacters(page + 1);
            setPage(prevPage => prevPage + 1);
            tmpCurrentBuffer = [...res];
            tmpChars = [...tmpChars, ...res.slice(0, 9 - takeCount)];
            tmpCurrentIndex = 9 - takeCount;
        }

        setChars(prevChars => [...prevChars, ...tmpChars]);
        setBufferChars(tmpCurrentBuffer);
        setCurrentIndex(tmpCurrentIndex);
        setNewCharsLoading(false);
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
    const viewSpinner = spinner && !newCharsLoading ? <Spinner /> : null;
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
                // style={charsListEnd ? { display: 'none' } : { display: 'block' }}
            >
                load more
            </button>
        </section>
    );
}

export default CharList;