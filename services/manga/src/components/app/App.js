import { BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom';
import { MangaInfo, MangaList } from '../pages/pages';

function App() {
    return (
        <div className="app">
            <BrowserRouter >
                <Routes>
                    <Route path="/" element={<Navigate to="/manga" />} />
                    <Route path='/manga' element={<MangaList />} />
                    <Route path='/manga/:id' element={<MangaInfo />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;