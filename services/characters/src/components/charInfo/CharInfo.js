import { useState, useEffect } from 'react';
import { useAnimeResources } from '@packages/shared';
import { Spinner } from '@packages/shared';
import { ErrorMessage } from '@packages/shared';
import Skeleton from '../skeleton/Skeleton';
import './charInfo.css';

function CharInfo({ charId }) {
    const [char, setChar] = useState(null);

    const { spinner, error, resetError, getCharacter } = useAnimeResources();

    useEffect(() => {
        updateCharInfo();
    }, [charId]);

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateCharInfo = () => {
        resetError();
        if (!charId) {
            return;
        }

        getCharacter(charId)
            .then(onCharLoaded);
    }

    const viewSkeleton = char || spinner || error ? null : <Skeleton />;
    const viewSpinner = spinner ? <Spinner /> : null;
    const viewError = error ? <ErrorMessage /> : null;
    const renderCharInfo = !(error || spinner || !char) ? <View char={char} /> : null;

    return (
        <aside className="char-aside">
            {viewSkeleton}
            {viewSpinner}
            {viewError}
            {renderCharInfo}
        </aside>
    );
}

function View({ char }) {
    const { name, description, thumbnail, homepage, wiki, comics } = char;
    const notImage = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';

    function renderComics(comics) {
        return (
            <ul className="char-comics-list">
                {comics.map((item, i) => {
                    return <li className="char-comics-item" key={i}>{item.anime.title}</li>
                })}
            </ul>
        );
    }

    return (
        <>
            <div className="char-basics">
                <img src={thumbnail} alt={name} style={thumbnail === notImage ? { objectFit: 'fill' } : null} className="char-aside-image" />
                <div className="char-visit">
                    <p className="char-info-name">{name}</p>
                    <div className="btns-container">
                        <a href={homepage} className="btn btn-active">homepage</a>
                        <a href={wiki} className="btn btn-default">wiki</a>
                    </div>
                </div>
            </div>
            <p className="char-descr">
                {description}
            </p>
            <p className="char-comics">Manga:</p>
            {comics.length > 0 ? renderComics(comics) : "No comics"}
        </>
    );
}

export default CharInfo;