import { Measurement } from './measurement';
import { MbscTemperatureOptions } from './temperature';

export interface MbscMassOptions extends MbscTemperatureOptions { }

export class Mass extends Measurement {
    settings: MbscMassOptions;
    constructor(element: any, settings: MbscMassOptions);
}