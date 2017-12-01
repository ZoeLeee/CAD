/*
 * @Author: Zoe 
 * @Date: 2017-12-01 10:25:11 
 * @Last Modified by: Zoe
 * @Last Modified time: 2017-12-01 16:37:47
 * 命令行组件
 */


import * as React from "react";
import './InputHint.css'

export interface InputHintProps 
{

}
interface ITodoItemState
{
    command: string,
    historyCommands: Array<string>,
    isShow: any,
    commands: Array<string>
}
export class InputHint extends React.Component<InputHintProps, ITodoItemState>
{
    public state: ITodoItemState;
    constructor(props: InputHintProps)
    {
        super(props);
        this.state =
            {
                command: "",
                historyCommands: [], //历史命令
                isShow: { display: 'none' },
                commands: ['LINE', 'LINETYPE', 'TR', 'TRANSLATE', 'TEXT1', 'TEXT2', 'TEXT3', 'TEXT4']
            }
    }
    //获取input输入的命令
    public handleGetInputValue = (e: any) =>
    {
        // 输入的命令
        let m_inputValue = e.target.value.toUpperCase();

        this.setState({ command: m_inputValue });
        let m_search = this.state.commands.indexOf(m_inputValue);
        console.log(m_search);
    }
    // 把输入命令添加到历史记录
    public handleAddHistory = (e: any) =>
    {
        let m_newHistotyCommand: Array<string> = this.state.historyCommands;
        if (e.key === 'Enter')
        {
            m_newHistotyCommand.push(this.state.command);
            this.setState({ historyCommands: m_newHistotyCommand });
            this.setState({ command: '' });
        }
    }
    public handleShowHistoryCommand = () =>
    {

        if (this.state.isShow.display === "none")
        {
            this.setState({ isShow: { display: 'block' } })
        } else
        {
            this.setState({ isShow: { display: 'none' } })
        }
    }
    public render() 
    {

        return (
            <div id="input-hint">

                <div className="input">
                    <a onClick={this.handleShowHistoryCommand}>
                        <span className="pt-icon-standard pt-icon-sort-asc pt-intent-primary"></span>
                    </a>
                    <span className="hint">命令</span>
                    <input type="text" placeholder="请输入命令" ref="command" onKeyPress={this.handleAddHistory} onChange={this.handleGetInputValue} value={this.state.command} />
                </div>
                <ul className="history-command" style={this.state.isShow}>
                    {
                        this.state.historyCommands.map((item: any, index: number) =>
                        {
                            return <li key={index}>{item}</li>
                        })
                    }
                </ul>

            </div>
        );
    }
}