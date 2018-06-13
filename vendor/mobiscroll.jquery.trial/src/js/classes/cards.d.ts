import { Base, MbscCoreOptions } from '../core/core';

export interface MbscCardOptions extends MbscCoreOptions {
}

export class Card extends Base {
    settings: MbscCardOptions;
    
    constructor(element: any, settings: any);
    
    refresh(shallow?: boolean): void;
}
