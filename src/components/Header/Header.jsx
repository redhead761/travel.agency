
import 'react';
import { useTranslation } from 'react-i18next';
import './Header.css';  // Подключаем файл стилей

function Header() {
    const { i18n } = useTranslation();

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
        <header className="header">
            <div className="language-buttons">
                <button onClick={() => handleLanguageChange('en')}>English</button>
                <button onClick={() => handleLanguageChange('ua')}>Українська</button>
            </div>
            <h1>{i18n.t('header.title')}</h1>
        </header>
    );
}

export default Header;
