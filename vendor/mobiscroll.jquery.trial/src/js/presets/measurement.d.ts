import { Scroller, MbscScrollerOptions } from '../classes/scroller';

export interface MbscMeasurementBaseOptions extends MbscScrollerOptions {
    // Settings
    max?: number;
    min?: number;
    defaultValue?: string;
    invalid?: Array<any>;
    scale?: number;
    step?: number;

    // localization
    wholeText?: string;
    fractionText?: string;
    signText?: string;
}

export interface MbscMeasurementOptions extends MbscMeasurementBaseOptions {
    // Settings
    convert(val: number, unit1: string, unit2: string): number;
}

export class Measurement extends Scroller {
    settings: MbscMeasurementBaseOptions;
    constructor(element: any, settings: MbscMeasurementBaseOptions);
}