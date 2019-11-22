import { h, render } from "preact";
import App from './layout/App';
import './styles.less';
import { RootStore } from "@src/stores";
import { Provider as MobxProvider } from 'mobx-preact';

const mobXStore = new RootStore();


render(
    <MobxProvider {...mobXStore}> <App/></MobxProvider>, document.getElementById('container')!
);
