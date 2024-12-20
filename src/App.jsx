import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n';

import Header from "./components/Header/Header.jsx";
import Auth from './components/Auth/Auth.jsx';
import Cabinet from "./components/Cabinet/Cabinet.jsx";
import Register from "./components/Register/Register.jsx";
import VoucherCard from "./components/VoucherCard/VoucherCard.jsx";
import Vouchers from './components/Vouchers/Vouchers.jsx';

function App() {
    return (
        <I18nextProvider i18n={i18n}>
            <Router>
                <Header />
                <Routes>
                    <Route path={"/"} element={<Auth/>}/>
                    <Route path={"/cabinet"} element={<Cabinet/>}/>
                    <Route path={"/register"} element={<Register/>}/>
                    <Route path={"/create-voucher"} element={<VoucherCard/>}/>
                    <Route path={"/vouchers"} element={<Vouchers/>}/>
                </Routes>
            </Router>
        </I18nextProvider>
    );
}

export default App;