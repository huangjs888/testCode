import React from 'react';

import ShowList from 'component/ShowList';
import { request } from 'util';
import api from 'api';

import './index.less';

export default class Page extends React.PureComponent {
    constructor(props) {
        super(props);
        this.bol =  true;
        this.state = {
            loading: true,
            data: []
        };
    }
    componentDidMount() {
        this.setState({
            loading: true
        });
        this.fetch().then(list => {
            this.setState({
                data: list
            }, _ => {
                this.setState({
                    loading: false
                });
                this.timerFetch = this.getTimerFetch();
            });
        }).catch(err => {});
    }
    componentWillUnmount() {
        clearInterval(this.timerFetch);
    }
    fetch() {
        return new Promise((resolve, reject) => {
            /*request(api.jobList).then((content) => {
                if (!content.isSuccess) {
                    let error = new Error('获取数据不成功');
                    reject(error);
                    console.error(error.message);
                } else resolve(content.returnValue);
            }).catch((error) => {
                reject(error);
                console.error(error.message);
            });*/

            import('../../data/data').then(data => {
                resolve(data.default(this.bol= !this.bol).returnValue)
            });
        });
    }
    getTimerFetch() {
        return setInterval(_ => {
            this.fetch().then(list => {
                this.setState({
                    data: list
                });
            }).catch(err => {});
        }, 5 * 60 * 1000);
    }
    parse(item) {
        return {
            name: item.name,
            url: `${api.jobUrl}positionCode=${item.code}`,
            city: item.workLocation,
            time: item.applyTimeDesc
        };
    }
    render() {
        const { loading, data } = this.state;
        return loading ? (<div className="loading">加载中...</div>) : (<ShowList parse ={this.parse} list={data} title="最新职位" moreUrl={api.moreJobUrl} />)
    }
}
