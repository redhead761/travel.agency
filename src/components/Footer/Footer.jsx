import './footer.scss';
import {useTranslation} from "react-i18next";


export default function Footer() {
    const {t} = useTranslation();
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__body">
                    <p>{t('footer.main')}</p>
                </div>
            </div>
        </footer>
    );
}
