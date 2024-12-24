import { useTranslation } from 'react-i18next';

export default function Cabinet() {
    const { t } = useTranslation();
    return (
        <div>
            <h2>{t('cabinet.cabinet')}</h2>
        </div>
    );
}
