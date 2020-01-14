import React from 'react';

import Title from './title';
import Item from './item';

import './index.less';

export default class ShowList extends React.Component {
    mouseOver = () => {
        clearInterval(this.timerAnimation);
    }
    mouseOut = () => {
        this.timerAnimation = this.getTimerAnimation();
    }
    constructor(props) {
        super(props);
        this.dataA = this.dataB = props.list;
        this.state = {
            top: 50
        };
    }
    componentDidMount() {
        this.timerAnimation = this.getTimerAnimation();
    }
    shouldComponentUpdate(nextProps, nextState) {
        //防止过来新的list会渲染数据
        return nextState.top !== this.state.top;
    }
    componentWillUnmount() {
        clearInterval(this.timerAnimation);
    }
    getTimerAnimation() {
        //定义一个定时器，每隔40毫秒将向上移动1像素
        return setInterval(_ => {
            let { top, data } = this.state;
            top -= 1;
            //如果移动到第一部分的底端，则立马重头开始移动
            if (top <= -950) {
                this.dataA = this.dataB;
                top = 50;
            }
            //只有当第一部分和第二部分交界处不在可视区域的时候才更新新的list
            if (top > -650 && top <= 0){
                this.dataB = this.props.list;
            }
            this.setState({
                top
            });
        }, 20);
    }
    render() {
        const { title, moreUrl, parse } = this.props;
        const listStyle = { top: `${this.state.top}px` };
        let dataA = this.dataA,
            dataB = this.dataB,
            length = dataA.length;
        return (
            <div className="newPosition-list">
              <Title url={moreUrl}>{title}</Title>
              <div className="position-list"
                onMouseOver={this.mouseOver}
                onMouseOut={this.mouseOut}
                style={listStyle}>
                {dataA.map( (it, i) => {
                    return <Item key={i} item={parse(it)} />
                })}
                {dataB.map( (it, i) => {
                    return <Item key={length + i} item={parse(it)} />
                })}
              </div>
            </div>
        )
    }
}
