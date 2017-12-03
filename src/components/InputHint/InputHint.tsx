/*
 * @Author: Zoe 
 * @Date: 2017-12-01 10:25:11 
 * @Last Modified by: Zoe
 * @Last Modified time: 2017-12-02 22:20:42
 * 命令行组件
 */

import * as React from "react";
import './InputHint.css'
import { HtmlHTMLAttributes } from "react";

export interface InputHintProps 
{

}
interface ITodoItemState
{
    command: string, //输入的命令
    historyCommands: Array<string>,// 历史命令
    isShow: React.CSSProperties,// 是否显示历史命令框
    commands: Array<string>, //命令库
    searchCommand: Array<string>, //联想命令库
    executeCommand: string //所执行的命令
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
                historyCommands: [],
                isShow: { display: 'none' },
                commands: ['LINE', 'LINETYPE', 'TR', 'TRANSLATE', 'TEXT1', 'TEXT2', 'TEXT3', 'TEXT4'],
                searchCommand: [],
                executeCommand: ''
            }
    }
    // 获取input输入的命令
    public handleGetInputValue = (e: React.FormEvent<HTMLInputElement>) =>
    {
        // 输入的命令
        let m_inputValue = e.currentTarget.value.toUpperCase();

        this.setState({ command: m_inputValue });
        //储存找到的相关命令
        let m_searchCommand: Array<string> = [];
        // 
        if (!m_inputValue) 
        {
            this.setState({ searchCommand: [] })
            return;
        }
        // 动态生成正则表达式
        let m_searchReg: RegExp = new RegExp('');
        // 拼接动态正则表达式
        let m_comTmp: string = '^' + m_inputValue.split('').join('\\w*') + '\\w*$';
        // 加g全局搜索 结果会交替是为什么？test()不用加g？
        m_searchReg = new RegExp(m_comTmp, 'i');

        this.state.commands.forEach((value: string) =>
        {

            // if (value.indexOf(m_inputValue) === 0)
            // {
            //     m_searchCommand.push(value);
            // }
            if (m_searchReg.test(value))
            {

                m_searchCommand.push(value);

            }
        })
        this.setState({ searchCommand: m_searchCommand });
        // 
    }
    // 把输入命令添加到历史记录
    public handleAddHistory = (e: { charCode: number }) =>  
    {
        let m_newHistotyCommand: Array<string> = this.state.historyCommands;

        //enter-13,space-32
        if (e.charCode === 13 || e.charCode === 32)
        {
            m_newHistotyCommand.push(this.state.command);
            this.setState({ historyCommands: m_newHistotyCommand });
            this.setState({ command: '' });
        }
    }
    // 是否显示历史命令
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
    // 确认执行命令
    public handleConfirmCommand = (e: any) =>
    {
        this.setState({ executeCommand: e.target.innerHTML });
        this.handleShowHistoryCommand();
        this.setState({ searchCommand: [], command: '' });
    }
    //方向键选择命令
    public handleSelectCommand = (e: any) =>
    {
        console.log(123);
    }
    componentDidMount()
    {
        let m_ul: any;
        let m_li: Array<any>;
        let m_liHover: any; // 当前hoverde li
        document.body.addEventListener('keydown', (e) =>
        {
            m_ul = this.refs.recommend;
            m_li = m_ul.children;
            m_liHover = m_ul.querySelector('.hover');
            //↑-38 ，↓-40
            if (e.keyCode === 38)
            {
                //如果找不到hover的元素，就给第一个hover
                if (!m_liHover)
                {
                    m_ul.firstElementChild.className = 'hover';
                } else
                {
                    if (m_liHover.previousElementSibling)
                    {
                        m_liHover.className = '';
                        m_liHover.previousElementSibling.className = 'hover'
                    } else
                    {
                        m_liHover.className = '';
                        m_ul.lastElementChild.className = 'hover';
                    }

                }

            } else if (e.keyCode === 40)
            {
                if (!m_liHover)
                {
                    m_ul.lastElementChild.className = 'hover';
                } else
                {
                    if (m_liHover.nextElementSibling)
                    {
                        m_liHover.className = '';
                        m_liHover.nextElementSibling.className = 'hover';
                    } else
                    {
                        m_liHover.className = '';
                        m_ul.firstElementChild.className = 'hover';
                    }
                }
            } else if (e.keyCode === 13 || e.keyCode === 32)
            {
                this.setState({ executeCommand: m_liHover.innerHTML });
                this.setState({ searchCommand: [], command: '' });
            }

        })
    }
    public render() 
    {

        return (
            <div id="input-hint" onKeyPress={this.handleSelectCommand}>
                <ul
                    className="recommend-command"

                    ref='recommend'>
                    {
                        this.state.searchCommand.map((item: any, index: number) =>
                        {
                            return <li onClick={this.handleConfirmCommand} key={index}>{item}</li>
                        })
                    }
                </ul>
                <div className="input">
                    <a onClick={this.handleShowHistoryCommand}>
                        <span className="pt-icon-standard pt-icon-sort-asc pt-intent-primary"></span>
                    </a>
                    <span className="hint">{this.state.executeCommand}</span>
                    <input
                        type="text"
                        placeholder="请输入命令"
                        ref="command"
                        onKeyPress={this.handleAddHistory}
                        onChange={this.handleGetInputValue}
                        value={this.state.command}
                    />
                </div>
                <ul className="history-command" style={this.state.isShow}>
                    {
                        this.state.historyCommands.map((item: any, index: number) =>
                        {
                            return <li onClick={this.handleConfirmCommand} key={index}>{item}</li>
                        })
                    }
                </ul>

            </div>
        );
    }
}