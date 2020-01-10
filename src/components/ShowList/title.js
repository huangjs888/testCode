import React from 'react';

export default (props) => (
    <div className="more-positon">
      <span className="more-position-title">{props.children}</span>
      {!props.url?'':(<a className="more-position-href" target="_blank" href={props.url}>更多</a>)}
    </div>
);
