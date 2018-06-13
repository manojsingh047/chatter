import { List } from './listbase';
import { MbscScrollerOptions } from  '../classes/scroller';

export interface MbscImageOptions extends MbscScrollerOptions {
    defaultValue?: Array<number>;
    enhance?: boolean;
    inputClass?: string;
    invalid?: Array<any>;
    labels?: Array<string>;
    placeholder?: string;
    showInput?: boolean;
}

export class ImageScroller extends List {
    settings: MbscImageOptions;
    constructor(element: any, settings: MbscImageOptions);
}