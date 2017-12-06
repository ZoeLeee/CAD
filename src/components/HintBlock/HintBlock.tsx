import * as React from 'react';
import './HintBlock.css';

export interface HintBlockProps
{

}


let HintBlock = (props: HintBlockProps) =>
{
    return (
        <div id="hint-block">
            <label></label>
            <input type="text" autoFocus />
            <label></label>
        </div>
    );
};
export default HintBlock;
