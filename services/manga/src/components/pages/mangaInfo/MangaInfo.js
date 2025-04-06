import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAnimeResources } from '@packages/shared';
import { Spinner } from '@packages/shared';
import { ErrorMessage } from '@packages/shared';

import './MangaInfo.css';

export function MangaInfo() {
    const [manga, setManga] = useState(null);
    const { id } = useParams();
    const { spinner, error, resetError, getManga } = useAnimeResources();

    useEffect(() => {
        getManga(id)
            .then(manga => setManga(manga));
    }, [id]);

    const viewSpinner = spinner ? <Spinner /> : null;
    const viewError = error ? <ErrorMessage /> : null;
    const renderMangaInfo = !(error || spinner || !manga) ? <View manga={manga} /> : null;

    return (
        <>
            {viewSpinner}
            {viewError}
            {renderMangaInfo}
        </>
    );

    function View({ manga }) {
        const { thumbnail, title, author, description, chapters, volumes, genres } = manga;

        const renderGenres = () => {
            return (
                <>
                    {genres.reduce((accumulator, item, index) => {
                        return index !== genres.length - 1 ? accumulator + item.name + ', ' : accumulator + item.name;
                    }, '')}
                </>
            );
        }

        const listGenre = renderGenres();

        return (
            <div className="single-comic">
                <img src={thumbnail} alt={title} className="single-comic__img" />
                <div className="single-comic__info">
                    <h2 className="single-comic__name">{title}</h2>
                    <p className="single-comic__descr">{description}</p>
                    <p className="single-comic__descr"><span className="single-comic__theme">Author:</span> {author[0].name}</p>
                    <p className="single-comic__descr"><span className="single-comic__theme">Chapters:</span> {chapters}</p>
                    <p className="single-comic__descr"><span className="single-comic__theme">Volumes:</span> {volumes}</p>
                    <p className="single-comic__descr"><span className="single-comic__theme">Genres:</span> {listGenre}</p>
                </div>
            </div>
        );
    }
}