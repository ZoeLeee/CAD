/*
 * @Author: Zoe 
 * @Date: 2017-11-30 14:32:48 
 * @Last Modified by: Zoe
 * @Last Modified time: 2017-11-30 14:47:41
 */

import * as React from "react";
import * as THREE from "Three";

const scene = new THREE.Scene();
console.log(scene);

export interface HelloProps { compiler: string; framework: string; }

export class Hello extends React.Component<HelloProps, {}> {
    render() {
        return <h1>Hello {this.props.compiler} and {this.props.framework}!</h1>;
    }
}