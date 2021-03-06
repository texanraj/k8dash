import _ from 'lodash';
import React from 'react';
import Base from '../components/base';
import Filter from '../components/filter';
import {MetadataHeaders, MetadataColumns, NoResults, hasResults} from '../components/listViewHelpers';
import api from '../services/api';
import test from '../utils/filterHelper';

export default class Ingresses extends Base {
    setNamespace(namespace) {
        this.setState({items: null});

        this.registerApi({
            items: api.ingress.list(namespace, items => this.setState({items})),
        });
    }

    render() {
        const {items, filter = ''} = this.state || {};
        const filtered = items && items.filter(x => test(filter, x.metadata.name));

        return (
            <div id='content'>
                <Filter
                    text='Ingresses'
                    filter={filter}
                    onChange={x => this.setState({filter: x})}
                    onNamespaceChange={x => this.setNamespace(x)}
                />

                <div className='contentPanel'>
                    <table>
                        <thead>
                            <tr>
                                <MetadataHeaders includeNamespace={true} />
                                <th>Hosts</th>
                                <th>Paths</th>
                            </tr>
                        </thead>

                        <tbody>
                            {hasResults(filtered) ? filtered.map(x => (
                                <tr key={x.metadata.uid}>
                                    <MetadataColumns
                                        item={x}
                                        includeNamespace={true}
                                        href={`#/ingress/${x.metadata.namespace}/${x.metadata.name}`}
                                    />
                                    <td>{_.map(x.spec.rules, y => y.host).join(' • ')}</td>
                                    <td>{_.flatMap(x.spec.rules, y => y.http.paths).map(y => y.path).join(' • ')}</td>
                                </tr>
                            )) : (
                                <NoResults items={filtered} filter={filter} colSpan='6' />
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
