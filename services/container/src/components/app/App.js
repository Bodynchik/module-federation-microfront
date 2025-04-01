import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '../header/Header';
import CharacterBlock from 'characters/CharacterBlock';
import { MangaInfo, MangaList } from 'manga/Manga';

function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <Header />
                <main>
                    <Routes>
                        <Route path='/' element={<CharacterBlock />} />
                        <Route path='/manga' element={<MangaList />} />
                        <Route path='/manga/:id' element={<MangaInfo />} />
                    </Routes>
                </main>
            </BrowserRouter>
        </div>
    );
}

export default App;