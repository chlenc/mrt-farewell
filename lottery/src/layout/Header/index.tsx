import { FunctionComponent, h } from 'preact';
import styles from './styles.less';
import Button from '../../Components/Button';
import Title from './Title';
import { inject, observer } from "mobx-preact";
import { RootStore } from "@src/stores";
import AccountStore from "@src/stores/AccountStore";
import cn from 'classnames'

interface IInjectedProps {
    accountStore?: AccountStore
}

interface IProps extends IInjectedProps {

}

const _Header: FunctionComponent<IProps> = ({accountStore}) => {

    const login = () => {
        accountStore!.login()
    }
    const account = accountStore!.wavesKeeperAccount;
    return <div className={styles.root}>
        <Button className={cn(styles.button, account != null && styles.margin)} onClick={() => {
        }} title="FAQ"/>
        <Title/>
        {account
            ? <div className={styles.account}>
                <div className={styles.avatar}/>
                <div className={styles.address}>{account.address}</div>
                <div className={styles.icn}/>
            </div>
            : <Button className={styles.button} onClick={login} title="Log in"/>
        }
    </div>;
};

const Header = inject((stores: RootStore) => ({accountStore: stores.accountStore}))(observer(_Header))

export default Header;
