import { executeAction } from 'mobx/lib/core/action';
import './InputHint.css';

import * as React from 'react';
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
    executeCommand: string, //所执行的命令
    viceCommand: string,//副命令
    pos: React.CSSProperties// 命令框位置
}
export class InputHint extends React.Component<InputHintProps, ITodoItemState>
{
    private m_recommendUl: HTMLUListElement;
    private m_liHover: Element; // 当前hoverde li
    private m_box: HTMLElement;
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
                executeCommand: '',
                viceCommand: '',
                pos: { left: 0, top: 0 }
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
        m_searchReg = new RegExp(m_comTmp, 'i');

        //如果没有确认执行命令，将显示关联的命令
        if (!this.state.executeCommand)
        {
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
            document.body.addEventListener('keydown', this.handleSelectCommand);
        } else
        {
            document.body.removeEventListener('keydown', this.handleSelectCommand);
        }
        // if (this.m_recommendUl)
        // {
        //     this.m_liHover = this.m_recommendUl.firstElementChild;
        //     console.log(this.m_liHover);
        //     this.m_liHover.className = 'hover';

        // }


    }
    // 把确认输入命令,并添加到历史记录
    public handleConfirmInput = (e: React.KeyboardEvent<HTMLInputElement>) =>  
    {
        let m_newHistotyCommand: Array<string> = this.state.historyCommands;
        //  enter-13,space-32
        if (this.state.command)
        {
            if (e.charCode === 13 || e.charCode === 32)
            {

                //如果没有确认执行命令，运行当前输入的命令，并将命令添加到历史
                if (!this.state.executeCommand)
                {
                    if (this.state.commands.indexOf(this.state.command) !== -1)
                    {
                        this.setState({ executeCommand: this.state.command });
                        m_newHistotyCommand.unshift(this.state.command);
                        this.setState({ historyCommands: m_newHistotyCommand });
                        this.setState({ command: '' });
                    }
                } else
                { // 已经有首条命令了，直接执行后续命名

                    this.setState({ viceCommand: '放弃(U)' });
                    this.setState({ command: '' });
                    if (this.state.command === 'U')
                    {
                        this.setState({ viceCommand: '' })
                    }
                }

            }
        } else // 如果没输入内容按空格将用最近用过的命令
        {
            if (e.charCode === 32)
            {
                this.setState({ executeCommand: this.state.historyCommands[0] });
            }
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
    public handleConfirmCommand = (e: React.MouseEvent<HTMLLIElement>) =>
    {
        this.setState({ executeCommand: e.currentTarget.innerHTML });
        this.handleShowHistoryCommand();
        this.setState({ searchCommand: [], command: '' });
    }
    //方向键选择命令
    public handleSelectCommand = (e: KeyboardEvent) =>
    {
        let ulContainer: HTMLUListElement;
        let m_li: HTMLCollection;
        let historyCommands = this.state.historyCommands;
        ulContainer = this.m_recommendUl;
        m_li = ulContainer.children;

        this.m_liHover = ulContainer.querySelector('.hover');

        //↑-38 ，↓-40 esc-27
        if (e.keyCode === 27) //按esc键
        {
            this.setState({ executeCommand: '', command: '' });
        } else if (e.keyCode === 38)
        {
            //如果找不到hover的元素，就给第一个hover
            if (!this.m_liHover)
            {
                ulContainer.firstElementChild.className = 'hover';
            } else
            {
                if (this.m_liHover.previousElementSibling)
                {
                    this.m_liHover.className = '';
                    this.m_liHover.previousElementSibling.className = 'hover'
                } else
                {
                    this.m_liHover.className = '';
                    ulContainer.lastElementChild.className = 'hover';
                }

            }

        } else if (e.keyCode === 40)
        {
            if (!this.m_liHover)
            {
                ulContainer.lastElementChild.className = 'hover';
            } else
            {
                if (this.m_liHover.nextElementSibling)
                {
                    this.m_liHover.className = '';
                    this.m_liHover.nextElementSibling.className = 'hover';
                } else
                {
                    this.m_liHover.className = '';
                    ulContainer.firstElementChild.className = 'hover';
                }
            }
        } else if (e.keyCode === 13 || e.keyCode === 32)
        {

            if (this.m_liHover)
            {

                if (!this.state.executeCommand)
                {
                    historyCommands.push(this.m_liHover.innerHTML);
                    this.setState({ historyCommands });
                }
                this.setState({ executeCommand: this.m_liHover.innerHTML });
                this.setState({ searchCommand: [], command: '' });
            }

        }
    }
    //移动命令框
    private moveBox = (x: number, y: number) =>
    {
        if (y >= window.innerHeight - 20)
        {
            this.m_box.parentElement.style.width = '100%';
            this.setState({ pos: { left: 0, bottom: 0 } });
        } else if (y < 20)
        {
            this.m_box.parentElement.style.width = '100%';
            this.setState({ pos: { left: 0, top: 0 } });
        } else
        {
            this.m_box.parentElement.style.width = '80%';
            this.setState({ pos: { left: x + 'px', top: y + 'px' } });
        }
    }
    public dragBox = () =>
    {
        let event = (e: MouseEvent) =>
        {
            this.moveBox(e.clientX, e.clientY);
        };
        this.m_box.ondrag = this.m_box.ondragend = event;
    }
    componentDidMount()
    {
        this.dragBox();
    }
    public render() 
    {

        return (
            <div id="input-hint" style={this.state.pos}>
                <ul
                    className="recommend-command"
                    ref={ul => { this.m_recommendUl = ul }}
                >
                    {
                        this.state.searchCommand.map((item: string, index: number) =>
                        {
                            return <li onClick={this.handleConfirmCommand} key={index}>{item}</li>
                        })
                    }
                </ul>
                <div
                    className="set"
                    ref={el => { this.m_box = el }}
                >
                    <a href="javascript:;" >
                        <span className="pt-icon-standard pt-icon-drag-handle-vertical"></span>
                    </a>
                </div>
                <div className="input">
                    <a onClick={this.handleShowHistoryCommand}>
                        <span className="pt-icon-standard pt-icon-sort-asc pt-intent-primary"></span>
                    </a>
                    <span className="hint">{this.state.executeCommand}</span>
                    <span className="hint">{this.state.viceCommand}</span>
                    <input
                        type="text"
                        placeholder="请输入命令"
                        ref="command"
                        onKeyPress={this.handleConfirmInput}
                        onChange={this.handleGetInputValue}
                        value={this.state.command}
                    />
                </div>
                <ul className="history-command" style={this.state.isShow}>
                    {
                        this.state.historyCommands.map((item: string, index: number) =>
                        {
                            return <li onClick={this.handleConfirmCommand} key={index}>{item}</li>
                        })
                    }
                </ul>

            </div>
        );
    }
}