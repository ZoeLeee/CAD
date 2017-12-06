import * as React from 'react';

import HintBlock from './HintBlock/HintBlock';

import InputHint from './InputHint/InputHint';


export default class App extends React.Component
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