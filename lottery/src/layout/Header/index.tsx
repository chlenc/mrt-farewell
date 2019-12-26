import { FunctionComponent, h } from 'preact';
import styles from './styles.less';
import Button, { ExchangeLink } from '../../Components/Button';
import Title from './Title';
import { inject, observer } from "mobx-preact";
import AccountStore from "@src/stores/AccountStore";
import cn from 'classnames';
import Avatar from '@src/Components/Avatar';
import { observable } from 'mobx';
import ModalStore from '@src/stores/ModalStore';
import LanguageStore, { TLangs } from "@src/stores/LanguageStore";

interface IInjectedProps {
    accountStore?: AccountStore
    modalStore?: ModalStore
    languageStore?: LanguageStore
}

interface IProps extends IInjectedProps {

}

let isFaq = observable.box(true);

const _Header: FunctionComponent<IProps> = ({accountStore, modalStore, languageStore}) => {

    const login = () => accountStore!.login();
    const logout = () => accountStore!.logout();

    const setLanguage = (l: TLangs) => () => languageStore!.setLanguage(l);

    const account = accountStore!.wavesKeeperAccount;
    const balance = accountStore!.mrtBalance;
    const {t} = languageStore!;
    return <div className={styles.root}>

        <div class={styles.buttonWrapper}>
            <ExchangeLink/>
        </div>
        <Title/>
        <div class={styles.buttonWrapper}>
            <div className={styles.buttonSet}>
                {languageStore!.lang === 'en'
                    ? <Button className={styles.button} onClick={setLanguage('ru')} title={'RU'}/>
                    : <Button className={styles.button} onClick={setLanguage('en')} title={'EN'}/>
                }
                <Button
                    className={cn(styles.button)} onClick={() => modalStore!.modal = 'faq'} title={t('faq')}/>
                {account
                    ?
                    <div className={styles.account}>
                        <Avatar size={20} address={account.address}/>
                        <div className={styles.addressBalance}>
                            <div className={styles.address}>{account.address}</div>
                            <div className={styles.balance}>{t('balance', {balance: balance})}</div>
                        </div>
                        <div className={styles.icn} onClick={logout}/>
                    </div>
                    : <Button className={styles.button} onClick={login} title={t('login')}/>
                }
            </div>
        </div>

    </div>;
};

const Header = inject('accountStore', 'modalStore', 'languageStore')(observer(_Header));

export default Header;
