import { Measurement, MbscMeasurementBaseOptions } from './measurement';

export interface MbscTemperatureOptions extends MbscMeasurementBaseOptions {
    // Settings
    convert?: boolean;
    defaultUnit?: string;
    unitNames?: any;
    units?: Array<string>;
}

export class Temperature extends Measurement {
    settings: MbscTemperatureOptions;
    constructor(element: any, settings: MbscTemperatureOptions);
}