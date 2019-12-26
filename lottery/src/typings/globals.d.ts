declare module '*.less';
declare module '*.svg';
declare module 'mobx-preact';
declare module 'preact-custom-scrollbars';
declare namespace JSX {
    interface Element {
        [elemName: string]: any;
    }
}

declare interface Window {
    dataLayer?: Array<any>
}
