export interface IItem {
    event: 'lotteryGoToExchange'
    [key: string]: any
}

export function logToTagManager(item: IItem) {
    if (Array.isArray(window.dataLayer)) {
        window.dataLayer && window.dataLayer.push(item);
    }
}

