import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAnimeResources } from '@packages/shared';
import { Spinner } from '@packages/shared';
import { ErrorMessage } from '@packages/shared';

import './mangaList.css';

export function MangaList() {
    const [mangaList, setMangaList] = useState([]);
    const [bufferManga, setBufferManga] = useState([]);
    const [newMangaLoading, setNewMangaLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(0);
    // const [comicsEnded, setComicsEnded] = useState(false);

    const { spinner, error, resetError, getAllManga } = useAnimeResources();

    useEffect(() => {
        fetchManga(page);
    }, [])

    const fetchManga = (page, takeCount) => {
        setNewMangaLoading(false);
        getAllManga(page)
            .then(newManga => {
                preparedData(newManga, takeCount);
            });
    }

    const preparedData = (newManga, takeCount = 0) => {
        if (newManga) {
            let tmpManga = newManga.slice(0, 8 - takeCount);
            setBufferManga(newManga);
            setCurrentIndex(8 - takeCount);
            setMangaList(prevManga => [...prevManga, ...tmpManga]);
        }
    }

    const onCharListLoaded = async () => {
        resetError();
        setNewMangaLoading(true);
        const takeCount = Math.min(8, bufferManga.length - currentIndex);
        let tmpManga = bufferManga.slice(currentIndex, currentIndex + takeCount);
        let tmpCurrentBuffer = [...bufferManga];
        let tmpCurrentIndex = currentIndex;
        tmpCurrentIndex += takeCount;

        if (bufferManga.length === 0) {
            fetchManga(page);
        } else if (tmpCurrentIndex >= bufferManga.length) {
            const res = await getAllManga(page + 1);
            setPage(prevPage => prevPage + 1);
            tmpCurrentBuffer = [...res];
            tmpManga = [...tmpManga, ...res.slice(0, 8 - takeCount)];
            tmpCurrentIndex = 8 - takeCount;
        }

        setMangaList(prevManga => [...prevManga, ...tmpManga]);
        setBufferManga(tmpCurrentBuffer);
        setCurrentIndex(prevIndex => prevIndex + takeCount);
        setNewMangaLoading(false);
    }

    const renderItems = manga => {
        return (
            <ul className="comics__grid">
                {manga.map(item => {
                    return (
                        <li className="comics__item" key={item.id}>
                            <Link to={`/manga/${item.id}`}>
                                <img src={item.thumbnail} alt={item.title} className="comics__item-img" />
                                <div className="comics__item-name">{item.title}</div>
                                <div className="comics__item-price">{item.author[0].name}</div>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        );
    }

    const renderList = renderItems(mangaList);
    const viewError = error ? <ErrorMessage /> : null;
    const viewSpinner = spinner && !newMangaLoading ? <Spinner /> : null;

    return (
        <div className="comics__list">
            {renderList}
            {viewError}
            {viewSpinner}
            <button
                disabled={newMangaLoading}
                // style={{ 'display': comicsEnded ? 'none' : 'block' }}
                className="char-more"
                onClick={onCharListLoaded}
            >
                load more
            </button>
        </div>
    )
}