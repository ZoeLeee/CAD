import HintBlock from './HintBlock/HintBlock';
import * as React from 'react';
import { InputHint } from './InputHint/InputHint';


export class App extends React.Component
{
    render() 
    {
        return (
            <div>
                <HintBlock />
                <InputHint />
            </div>
        );
    }

}