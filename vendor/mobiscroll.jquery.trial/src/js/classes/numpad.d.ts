import { Frame, MbscFrameOptions } from './frame';

export interface MbscNumpadOptions extends MbscFrameOptions {
    // Settings
    allowLeadingZero?: boolean;
    deleteIcon?: string;
    fill?: 'ltr' | 'rtl';
    leftKey?: { text: string, variable?: string, value?: string };
    mask?: string;
    placeholder?: string;
    rightKey?: { text: string, variable?: string, value?: string };
    template?: string;

    // Events
    onSet?(event: { valueText: string }, inst: any): void;
    validate?(data: { values: Array<any>, variables: any }, inst: any): ({ disabled: Array<any>, invalid: boolean });
    onClear?(event: any, inst: any): void;

    // localization
    cancelText?: string;
    clearText?: string;
    setText?: string;
}

export class Numpad extends Frame {
    settings: MbscNumpadOptions;
    constructor(element: any, settings: MbscNumpadOptions);

    setVal(val: string | number | Date, fill?: boolean, change?: boolean, temp?: boolean): void;
    getVal(temp?: boolean): string | number | Date;
    setArrayVal(val: Array<any>, fill?: boolean, change?: boolean, temp?: boolean): void;
    getArrayVal(temp?: boolean): Array<any>;
}
