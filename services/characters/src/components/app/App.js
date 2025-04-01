import { useState } from 'react';
import RandomChar from '../randomChar/RandomChar';
import CharList from '../charList/CharList';
import CharInfo from '../charInfo/CharInfo';

function App() {
    const [charId, setCharId] = useState(null);

    const onSelectedChar = (id) => {
        setCharId(id);
    }

    return (
        <>
            <RandomChar />
            <div className="main-content" style={{maxWidth: '1100px'}}>
                <CharList onSelectedChar={onSelectedChar} />
                <CharInfo charId={charId} />
            </div>
        </>
    );
}

export default App;