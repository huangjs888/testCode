import React from 'react';

import Title from './title';
import Item from './item';

import './index.less';

export default class ShowList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            top: 50,
            dataFirst: props.list,
            dataSecond: props.list
        };
    }
    getTimerAnimation() {
        return setInterval(_ => {
            let { top, dataSecond } = this.state;
            this.setState({
                top: top - 1
            });
            if (top <= -950) {
                this.setState({
                    top: 50,
                    dataFirst: dataSecond,
                    dataSecond: this.props.list
                });
            }
        }, 40);
    }
    mouseOver() {
        clearInterval(this.timerAnimation);
    }
    mouseOut() {
        this.timerAnimation = this.getTimerAnimation();
    }
    componentWillReceiveProps(nextProps) {
        let { top } = this.state;
        if (top > -650 && top <= 0) {
            this.setState({
                dataSecond: nextProps.list
            });
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.top !== this.state.top ||
            nextState.dataSecond !== this.state.dataSecond ||
            nextState.dataFirst !== this.state.dataFirst;
    }
    componentDidMount() {
        this.timerAnimation = this.getTimerAnimation();
    }
    componentWillUnmount() {
        clearInterval(this.timerAnimation);
    }
    render() {
        const { title, moreUrl, parse } = this.props;
        const { top, dataFirst, dataSecond } = this.state;
        const listStyle = { top: `${top}px` };
        let length = dataFirst.length;
        return (
            <div className="newPosition-list">
              <Title url={moreUrl}>{title}</Title>
              <div className="position-list"
                onMouseOver={this.mouseOver.bind(this)}
                onMouseOut={this.mouseOut.bind(this)}
                style={listStyle}>
                {dataFirst.map( (it, i) => {
                    return <Item key={i} item={parse(it)} />
                })}
                {dataSecond.map( (it, i) => {
                    return <Item key={length + i} item={parse(it)} />
                })}
              </div>
            </div>
        )
    }
}
