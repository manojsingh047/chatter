import { INITIAL_BOT_MSGS, MOM_MOCK, RETRO_MOCK, STORY_MOCK } from "./mocks"

export const ACTION = {
    mom: {
        key: 'mom',
        label: 'Meeting Minutes'
    },
    retro: {
        key: 'retro',
        label: 'Retro'
    },
    story: {
        key: 'story',
        label: 'Generate Stories'
    },
}

export const delay = (delay = 2000) => new Promise(res => setTimeout(res, delay));

export const fetchApi = async (action, body) => {

    switch (action) {
        case 'initial':
            await delay(1000);
            return INITIAL_BOT_MSGS;
        case ACTION.mom.key:
            await delay(2000);
            return MOM_MOCK;
        case ACTION.retro.key:
            await delay(3000);
            return RETRO_MOCK;
        case ACTION.story.key:
            await delay(3000);
            return STORY_MOCK;
    }

}