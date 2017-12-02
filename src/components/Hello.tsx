/*
 * @Author: Zoe 
 * @Date: 2017-11-30 14:32:48 
 * @Last Modified by: Zoe
 * @Last Modified time: 2017-11-30 17:09:32
 */

import * as React from "react";

export interface HelloProps { compiler: string; framework: string; }

export class Hello extends React.Component<HelloProps, {}> {
    render()
    {
        return <h1>
            <i className="fa fa-file"></i>
        </h1>;
    }
}