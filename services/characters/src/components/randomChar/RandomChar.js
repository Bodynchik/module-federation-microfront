import { useState, useEffect } from 'react';
import { Spinner } from '@packages/shared';
import { ErrorMessage } from '@packages/shared';
import { useAnimeResources } from '@packages/shared';

import './randomChar.css';

function RandomChar() {
    const [char, setChar] = useState(null);

    const { spinner, error, resetError, getCharacter } = useAnimeResources();

    useEffect(() => {
        updateRandomChar();
    }, []);

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateRandomChar = () => {
        resetError();
        const id = Math.floor(Math.random() * 5000) + 1;;
        getCharacter(id)
            .then(onCharLoaded);
    }

    const viewSpinner = spinner ? <Spinner /> : null;
    const viewError = error ? <ErrorMessage /> : null;
    const randChar = !(viewSpinner || viewError || !char) ? <Block char={char} /> : null;

    return (
        <section className="random-section">
            <div className="random-char">
                {randChar}
                {viewSpinner}
                {viewError}
            </div>
            <div className="random-static">
                <p className="random-static-par">Random character for today!<br />
                    Do you want to get to know him better?</p>
                <p className="random-static-par">Or choose another one</p>
                <button onClick={updateRandomChar} className="btn btn-active">try it</button>
            </div>
        </section>
    );
}

function Block({ char }) {
    const { name, description, thumbnail, homepage, wiki } = char;
    const notImage = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';

    return (
        <>
            <img src={thumbnail} alt="character" className="random-img" style={thumbnail === notImage ? { objectFit: 'contain' } : null} />
            <div className="char-info">
                <h2 className="random-char-header">{name}</h2>
                <p className="random-descr">{description}</p>
                <div className="random-btns">
                    <a href={homepage} className="btn btn-active">homepage</a>
                    <a href={wiki} className="btn btn-default">wiki</a>
                </div>
            </div>
        </>
    );
}

export default RandomChar;