import './InputHint.css';

import * as React from 'react';
import { DOMElement, ReactElement } from 'react';

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
    viceCommand: Array<{ title: string, keyboard: string }>,//副命令
    pos: React.CSSProperties// 命令框位置
}
export class InputHint extends React.Component<InputHintProps, ITodoItemState>
{
    private m_recommendUl: HTMLUListElement;
    private m_liHover: Element; // 当前hoverde li
    private m_box: HTMLElement;
    public state: ITodoItemState;
    private m_i: number = 0; //选择历史命令索引
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
                viceCommand: [],
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

                if (m_searchReg.test(value))
                {

                    m_searchCommand.push(value);

                }
            })
            this.setState({ searchCommand: m_searchCommand });

        }


    }
    // 把确认输入命令,并添加到历史记录
    public handleConfirmInput = (e: React.KeyboardEvent<HTMLInputElement>) =>  
    {


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
        document.onclick = () =>
        {
            this.setState({ isShow: { display: 'none' } });
            document.onclick = null;
        }
    }
    // 确认执行命令
    public handleConfirmCommand = (e: React.MouseEvent<HTMLLIElement>) =>
    {
        this.setState({ executeCommand: e.currentTarget.innerHTML });
        this.handleShowHistoryCommand();
        this.setState({ searchCommand: [], command: '' });
    }
    //绑定键盘命令
    public handleSelectCommand = (e: KeyboardEvent) =>
    {
        console.log('watch key');
        let m_li: HTMLCollection = this.m_recommendUl.children;;
        let historyCommands = this.state.historyCommands;

        this.m_liHover = this.m_recommendUl.querySelector('.hover');
        //放下键选择命令函数,des-方向
        let selectCommand = (des: string) => 
        {
            let el1: Element;
            let el2: Element;
            if (des === 'up')
            {
                el1 = this.m_liHover.previousElementSibling;
                el2 = this.m_recommendUl.lastElementChild;
                //将选中的命令显示到命令框

            }
            else
            {
                el1 = this.m_liHover.nextElementSibling;
                el2 = this.m_recommendUl.firstElementChild;
                //将选中的命令显示到命令框

            }
            if (el1)
            {
                this.m_liHover.className = '';
                el1.className = 'hover';
                this.m_liHover = el1;
            }
            else
            {
                this.m_liHover.className = '';
                el2.className = 'hover';
                this.m_liHover = el2;

            }
            this.setState({ command: this.m_liHover.innerHTML });
        }
        //↑-38 ，↓-40 esc-27
        if (e.keyCode === 27) //按esc键,清空所有命令
        {
            this.setState(
                {
                    executeCommand: '',
                    command: '',
                    searchCommand: [],
                    viceCommand: [],
                    isShow: { display: 'none' }
                }
            );
            console.log('esc');
        }
        //如果有关联命令执行以下逻辑
        if (this.state.searchCommand.length > 0)
        {

            if (e.keyCode === 38)
            {

                selectCommand('up');

            }
            else if (e.keyCode === 40)
            {
                selectCommand('down');

            }


            if (e.keyCode === 13 || e.keyCode === 32)
            {
                //如果没有确认执行命令，运行当前输入的命令，并将命令添加到历史
                if (!this.state.executeCommand)
                {
                    historyCommands.unshift(this.m_liHover.innerHTML);

                    this.setState({ historyCommands });
                    this.setState(
                        {
                            executeCommand: this.m_liHover.innerHTML,
                            searchCommand: [],
                            command: ''
                        }
                    );
                }
                else // 已经有首条命令了，直接执行后续命名
                {
                    this.setState({ viceCommand: [{ title: '放弃', keyboard: 'U' }] });
                    this.setState({ command: '' });
                    if (this.state.command === 'U')
                    {
                        this.setState({ viceCommand: [] })
                    }
                }

            }
        } else //没有关联命令执行
        {
            // 如果存在历史命令,方向键切换历史命令
            if (this.state.historyCommands.length > 0)
            {
                if (e.keyCode === 40)
                {

                    if (this.m_i >= this.state.historyCommands.length) this.m_i = 0;
                    this.setState({ command: this.state.historyCommands[this.m_i] });
                    this.m_i++;
                }
                else if (e.keyCode === 38)
                {

                    if (this.m_i < 0) this.m_i = this.state.historyCommands.length - 1;
                    this.setState({ command: this.state.historyCommands[this.m_i] });
                    this.m_i--;
                }

                if (e.keyCode === 13 || e.keyCode === 32)
                {
                    this.setState(
                        {
                            executeCommand: this.state.command,
                            command: ''
                        }
                    );
                }
            }
        }

    }
    //移动命令框
    private moveBox = (x: number, y: number) =>
    {

    }
    public dragBox = () =>
    {
        let isMove: Boolean = false;//能否移动
        this.m_box.onmousedown = () =>
        {
            isMove = true;
        }
        this.m_box.onmouseup = () =>
        {
            isMove = false;
            document.onmousemove = null;
        }
        document.onmousemove = (e: MouseEvent) =>
        {
            if (isMove)
            {
                if (e.clientY >= window.innerHeight - 20)
                {
                    this.m_box.parentElement.style.width = '100%';
                    this.setState({ pos: { left: 0, bottom: 0 } });
                } else if (e.clientY < 20)
                {
                    this.m_box.parentElement.style.width = '100%';
                    this.setState({ pos: { left: 0, top: 0 } });
                } else
                {
                    this.m_box.parentElement.style.width = '80%';
                    this.setState({ pos: { left: e.clientX + 'px', top: e.clientY + 'px' } });
                }
            }
            else
            {

            }
        }
    }
    public handleClick = (e: React.MouseEvent<HTMLElement>) =>
    {

        let m_key = e.currentTarget.firstElementChild.innerHTML.slice(1, 2);
        if (m_key === 'U')
        {
            this.setState({ viceCommand: [] });
        }
    }
    //鼠标选择命令
    public handleSelectCom = (e: React.MouseEvent<HTMLUListElement>) =>
    {

        this.m_liHover = this.m_recommendUl.querySelector('.hover');
        if (this.m_liHover)
        {
            this.m_liHover.className = '';
        }
        (e.target as HTMLElement).className = 'hover';
    }
    componentDidMount()
    {
        this.dragBox();
        document.body.addEventListener('keydown', this.handleSelectCommand);
    }
    componentDidUpdate()
    {
        //当没有选中命令时，默认第一个选中
        if (!this.m_recommendUl.querySelector('.hover'))
        {
            if (this.m_recommendUl.firstElementChild)
            {
                this.m_recommendUl.firstElementChild.className = 'hover';
            }
        }

    }
    public render()
    {

        return (
            <div id="input-hint" style={this.state.pos}>
                <ul
                    className="recommend-command"
                    ref={ul => { this.m_recommendUl = ul }}
                    onMouseMove={this.handleSelectCom}
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
                    <a >
                        <span className="pt-icon-standard pt-icon-drag-handle-vertical"></span>
                    </a>
                </div>
                <div className="input">
                    <a onClick={this.handleShowHistoryCommand}>
                        <span className="pt-icon-standard pt-icon-sort-asc pt-intent-primary"></span>
                    </a>
                    <span className="hint">{this.state.executeCommand}</span>
                    {
                        this.state.viceCommand.map((item, index: number) =>
                        {
                            return (
                                <span key={index}
                                    className="hint vice-hint"
                                    onClick={this.handleClick}
                                >
                                    [{item.title}<span>({item.keyboard})</span>]
                                </span>
                            )
                        })
                    }

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