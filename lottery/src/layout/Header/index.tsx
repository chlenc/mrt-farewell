import { FunctionComponent, h } from 'preact';
import styles from './styles.less';
import Button from '../../Components/Button';
import Title from './Title';
import { inject, observer } from "mobx-preact";
import AccountStore from "@src/stores/AccountStore";
import cn from 'classnames';
import Avatar from '@src/Components/Avatar';
import { observable } from 'mobx';
import ModalStore from '@src/stores/ModalStore';
import LanguageStore from "@src/stores/LanguageStore";

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

    const account = accountStore!.wavesKeeperAccount;
    const balance = accountStore!.mrtBalance;
    const {t} = languageStore!;
    return <div className={styles.root}>

        <div class={styles.buttonWrapper}>
            <Button
                className={cn(styles.button)} onClick={() => modalStore!.modal = 'faq'} title={t('faq')}/>
        </div>
        <Title/>
        {account
            ? <div class={styles.buttonWrapper}>
                <div className={styles.account}>
                    <Avatar size={20} address={account.address}/>
                    <div className={styles.addressBalance}>
                        <div className={styles.address}>{account.address}</div>
                        <div className={styles.balance}>{t('balance', {balance: balance})}</div>
                    </div>
                    <div className={styles.icn} onClick={logout}/>
                </div>
            </div>
            :
            <div class={styles.buttonWrapper}>
                <Button className={styles.button} onClick={login} title={t('login')}/>
            </div>
        }
    </div>;
};

const Header = inject('accountStore', 'modalStore', 'languageStore')(observer(_Header));

export default Header;
