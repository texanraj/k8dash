import {Component} from 'react';
import log from '../utils/log';

export default class Base extends Component {
    async componentWillUnmount() {
        await this.clearDisposers();
    }

    async registerApi(apis) {
        if (!this.apis) this.apis = {};

        for (const [name, api] of Object.entries(apis)) {
            await this.clearDisposer(name);
            this.apis[name] = api;
        }
    }

    async clearDisposers() {
        for (const name of Object.keys(this.apis || {})) {
            this.clearDisposer(name);
        }
    }

    async clearDisposer(name) {
        if (!this.apis || !this.apis[name]) return;

        const item = this.apis[name];
        delete this.apis[name];

        const handler = await item;
        if (!handler) {
            log.warn('Found null handler when calling disposers');
            return;
        }

        handler();
    }
}
