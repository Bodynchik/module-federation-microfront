import { NavLink } from 'react-router-dom';

import './header.css';

function Header() {
    return (
        <header className="header">
            <h1 className="header-h1"><span className="active">Anime</span> information portal</h1>
            <nav className="header-nav">
                <ul className="header-list">
                    <li>
                        <NavLink
                            to='/'
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >Characters
                        </NavLink>
                    </li>
                    /
                    <li>
                        <NavLink
                            to='/manga'
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >Manga
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;