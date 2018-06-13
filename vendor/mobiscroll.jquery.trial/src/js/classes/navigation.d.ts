import { NavigationBase, MbscNavBaseOptions } from './navigation-base';

export interface MbscNavOptions extends MbscNavBaseOptions {
    type: 'bottom' | 'hamburger' | 'tab';
    moreText: string;
    moreIcon: string;
    menuText: string;
    menuIcon: string;
}

export class Navigation extends NavigationBase {
    settings: MbscNavOptions;
    constructor(element: any, settings: MbscNavOptions);
}
