import React from "react";
import ReactDOM from "react-dom";
import { Router, IndexRoute, hashHistory } from "react-router";
import { HashRouter, Route, Link } from "react-router-dom";

import Sidebar from './components/sidebar';
import LayoutA from './components/layoutA';
import LayoutB from './components/layoutB';
import LayoutC from './components/layoutC';
import LayoutD from './components/layoutD';
import Selector from './components/selector';

const app = document.getElementById('app'); 

ReactDOM.render(
    <HashRouter history={hashHistory}>
        <div>
            <Route exact path="/" component={Selector}/>
            <Route path="/A/:client" component={LayoutA}/>
            <Route path="/B/:client" component={LayoutB}/>
            <Route path="/C/:client" component={LayoutC}/>
            <Route path="/D/:client" component={LayoutD}/>
        </div> 
    </HashRouter>, 
app);