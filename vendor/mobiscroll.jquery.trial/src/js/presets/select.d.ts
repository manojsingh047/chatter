import { Scroller, MbscScrollerOptions } from '../classes/scroller';
import { MbscDataControlOptions } from '../classes/frame';

export type MbscDataScrollerOptions = MbscDataControlOptions & MbscScrollerOptions;

export interface MbscSelectOptions extends MbscDataScrollerOptions {
    // Settings
    counter?: boolean;
    data?: Array<{ text?: string, value?: any, group?: string, html?: string, disabled?: boolean }> | {
        url: string,
        dataField?: string,
        dataType?: 'json' | 'jsonp',
        processResponse?: (data: any) => Array<{ text?: string, value?: any, group?: string, html?: string, disabled?: boolean }>,
        remoteFilter?: boolean
    };
    dataText?: string;
    dataGroup?: string;
    dataValue?: string;
    group?: boolean | { header?: boolean, groupedWheel?: boolean, clustered?: boolean };
    groupLabel?: string;
    inputClass?: string;
    invalid?: Array<any>;
    label?: string;
    placeholder?: string;
    showInput?: boolean;
}

export class Select extends Scroller {
    settings: MbscScrollerOptions;
    constructor(element: any, settings: MbscScrollerOptions);
    setVal(val: string | number | Array<string | number>, fill?: boolean, change?: boolean, temp?: boolean, time?: number): void;
    getVal(temp?: boolean, group?: boolean): string | number | Array<string | number>;
    refresh(data?: Array<{ text?: string, value?: any, group?: string, html?: string, disabled?: boolean }>, filter?: string, callback?: () => void): void;
}