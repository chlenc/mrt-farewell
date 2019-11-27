declare module '*.less';
declare module 'mobx-preact';
declare module 'preact-custom-scrollbars';
declare namespace JSX {
    interface Element {
        [elemName: string]: any;
    }
}

