import * as React from 'react';
import './HintBlock.css';

export interface HintBlockProps
{
}

export interface HintBlockState 
{
    pos: React.CSSProperties; //提示块位置
    isShow: React.CSSProperties;
}

export default class HintBlock extends React.Component<HintBlockProps, HintBlockState>
{
    public state: HintBlockState;
    constructor(props: HintBlockProps)
    {
        super(props);

        this.state =
            {
                isShow: {},
                pos: { display: 'none', left: 0, top: 0 }
            }
    }
    public handleshowBlock()
    {
        document.addEventListener('click', (e) =>
        {

            this.setState({ pos: { display: 'block', left: e.clientX + 20 + 'px', top: e.clientY + 20 + 'px' } });
            document.addEventListener('mousemove', (e) =>
            {
                this.setState({ pos: { display: 'block', left: e.clientX + 20 + 'px', top: e.clientY + 20 + 'px' } });
            })

        })
    }
    componentDidMount()
    {



    }
    render() 
    {
        return (
            <div id="hint-block" style={this.state.pos}>
                <label></label>
                <input type="text" autoFocus />
                <label></label>
            </div>
        );
    }
}
