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
    private m_recommendUl: HTMLUListElement;//关联命令列表
    private m_liHover: Element; // 当前hover的 li
    private m_box: HTMLElement;//移动命令框区
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

        //如果没有确认执行命令，将显示推荐索引的命令
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
    // 点击确认执行命令
    public handleConfirmCommand = (e: React.MouseEvent<HTMLLIElement>) =>
    {
        this.setState({ executeCommand: e.currentTarget.innerHTML });
        this.handleShowHistoryCommand();
        this.setState({ searchCommand: [], command: '' });
    }
    //绑定键盘命令
    public handleSelectCommand = (e: KeyboardEvent) =>
    {
        (this.refs.command as HTMLInputElement).focus();

        let m_li: HTMLCollection = this.m_recommendUl.children;;
        let historyCommands = this.state.historyCommands;
        this.m_liHover = this.m_recommendUl.querySelector('.hover');

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
            return;
        }
        //如果没输入命令，空格键为上一次输入命令
        if (!this.state.command && this.state.historyCommands.length > 0)
        {
            if (e.keyCode === 32)
            {
                this.setState({ command: this.state.historyCommands[0].trim() });
                return;
            }
            
        }

        //放下键选择命令函数,des-方向
        let selectCommand = (des: string) => 
        {
            let el1: Element;
            let el2: Element;

            if (des === 'up')
            {
                el1 = this.m_liHover.previousElementSibling;
                el2 = this.m_recommendUl.lastElementChild;
            }
            else
            {
                el1 = this.m_liHover.nextElementSibling;
                el2 = this.m_recommendUl.firstElementChild;
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
                if (!this.state.executeCommand)
                {
                    historyCommands.unshift(this.m_liHover.innerHTML);
                    //去掉重复历史命令
                    historyCommands = Array.from(new Set(historyCommands));
                    this.setState({ historyCommands });
                    this.setState(
                        {
                            executeCommand: this.m_liHover.innerHTML,
                            searchCommand: [],
                            command: ''
                        }
                    )
                    return;
                }
            }
        }
        else if (!this.state.executeCommand )  //否则如果没有执行命令
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
            }
        }    

        //确认选中命令
        if (e.keyCode === 13 || e.keyCode === 32)
        {
            //如果没有确认执行命令，运行当前输入的命令，并将命令添加到历史
            if (!this.state.executeCommand )
            {

                if (this.state.command && this.state.commands.indexOf(this.state.command.trim()) !== -1)
                {
                    this.setState(
                        {
                            executeCommand: this.state.command,
                            searchCommand: [],
                            command: ''
                        }
                    );
                }
                else
                {
                    //TODO:输入命令有误
                }
            }
            else // 已经有首条命令了，直接执行后续命名
            {
                //TODO:发送输入命令
                
                if (this.state.command === 'U')
                {
                    this.setState({ viceCommand: [],command:'' });
                    return;
                }
                this.setState(
                    {
                        viceCommand: [{ title: '放弃', keyboard: 'U' }],
                        command: ''
                    }
                );
                
            }

        }
    }
    //移动命令框
    public dragBox = () =>
    {
        //移动回调函数
        let movePos = (e: MouseEvent) =>
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
        this.m_box.onmousedown = () =>
        {
            document.addEventListener('mousemove', movePos);
        }
        this.m_box.onmouseup = () =>
        {
            document.removeEventListener('mousemove', movePos);
        }
    }
    // 点击确认命令
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
            this.m_liHover = this.m_recommendUl.firstElementChild;
            if (this.m_liHover)
            {

                this.m_liHover.className = 'hover';

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