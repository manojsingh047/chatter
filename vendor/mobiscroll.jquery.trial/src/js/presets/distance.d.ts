import { Measurement } from './measurement';
import { MbscTemperatureOptions } from './temperature';

export interface MbscDistanceOptions extends MbscTemperatureOptions { }

export class Distance extends Measurement {
    settings: MbscDistanceOptions;
    constructor(element: any, settings: MbscDistanceOptions);
}