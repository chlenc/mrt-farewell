import { FunctionComponent, h } from 'preact';
import styles from './styles.less';
import Button from '../../Components/Button';
import Title from './Title';
import { inject, observer } from "mobx-preact";
import { RootStore } from "@src/stores";
import AccountStore from "@src/stores/AccountStore";
import cn from 'classnames';

interface IInjectedProps {
    accountStore?: AccountStore
}

interface IProps extends IInjectedProps {

}

const _Header: FunctionComponent<IProps> = ({accountStore}) => {

    const login = () => accountStore!.login();
    const logout = () => accountStore!.logout();

    const account = accountStore!.wavesKeeperAccount;
    const balance = accountStore!.mrtBalance;
    return <div className={styles.root}>
        <div class={styles.buttonWrapper}>
            <Button className={cn(styles.button)} onClick={() => {
            }} title="FAQ"/>
        </div>
        <Title/>
        {account
            ? <div class={styles.buttonWrapper}>
                <div className={styles.account}>
                    <div className={styles.avatar}/>
                    <div className={styles.addressBalance}>
                        <div className={styles.address}>{account.address}</div>
                        <div className={styles.balance}>Balance: {balance} MRT</div>
                    </div>
                    <div className={styles.icn} onClick={logout}/>
                </div>
            </div>
            :
            <div class={styles.buttonWrapper}>
                <Button className={styles.button} onClick={login} title="Log in"/>
            </div>
        }
    </div>;
};

const Header = inject((stores: RootStore) => ({accountStore: stores.accountStore}))(observer(_Header));

export default Header;
