import React from 'react';

export default ({ item = {} }) => (
    <div className="scroll-li">
        <a className="position"
            target="_blank"
            href={item.url}
            title={item.name}>{item.name}</a>
        <em className="city" title={item.city}>{item.city}</em>
        <em className="time" title={item.time}>{item.time}</em>
    </div>
);
