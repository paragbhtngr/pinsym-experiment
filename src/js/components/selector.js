import React from "react";
import clients from "../data/clientNames";

export default class Selector extends React.Component {
    constructor() {
        super()
        this.state = {
            modes: ["A","B","C","D"],
            clients,
            mode: undefined,
            client: undefined,
        };
        
        this.handleModeChange = this.handleModeChange.bind(this);
        this.handleClientChange = this.handleClientChange.bind(this);
        this.handleRedirect = this.handleRedirect.bind(this);
    }

    handleModeChange(event) {
        this.setState({ mode: event.target.value });
    }

    handleClientChange(event) {
        this.setState({ client: event.target.value });
    }

    handleRedirect() {
        if(this.state.mode && this.state.client) {
            window.location.reload(true);
            window.location.href = '/#/'+this.state.mode+'/'+this.state.client;
        } else {
            alert("Please select a mode and client");
        }
    }

    render() {
        let makeOption = (x) => {
            return <option key={x} value={x}>{x}</option>;
        }
        return (
            <div>
                <div
                    className="container"
                >
                    <h1>Selector Page</h1>
                    <div
                        className="panel"
                    >   
                        <form>
                            <select value={this.state.mode} onChange={this.handleModeChange}>
                                <option defaultValue hidden>Select a Display</option>
                                {this.state.modes.map(makeOption)}
                            </select>
                            <br/>
                            <br/>
                            <select value={this.state.client} onChange={this.handleClientChange}>
                                <option defaultValue hidden>Select a client</option>
                                {this.state.clients.map(makeOption)}
                            </select>
                            <br/>
                            <br/>
                            <div>
                                <p>Mode: {this.state.mode}</p>
                                <p>Client: {this.state.client}</p>                           
                            </div>                            
                            <button type="button" class="btn btn-large btn-default" onClick={this.handleRedirect}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}