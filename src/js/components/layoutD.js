
import React from "react";
import Sidebar from "./sidebarD";
import Comment from "./comment";
import ActiveCommentSegment from "./activeCommentSegment";
import DataStore from "../stores/DataStore";
import {default as UUID} from "uuid";

export default class Layout extends React.Component {
    constructor(props) {
        super()
        this.state = {
            mode: "3D81G",
            clientName: props.match.params.client,
            activeSegment: DataStore.getActiveSegment(),
            data: DataStore.getSegmentsByClientCode(props.match.params.client, DataStore.getActiveSegment()),
            newComment: undefined,
        };

        this.getActiveCommentByID = this.getActiveCommentByID.bind(this);
        this.handleNewCommentChange = this.handleNewCommentChange.bind(this);
        this.makeComment = this.makeComment.bind(this);
        this.getActiveComments = this.getActiveComments.bind(this);
    }

    getActiveCommentByID(commentID) {
        return this.state.data.filter(function (el) {
            return el.id === commentID;
        });
    }

    makeComment = (x, index) => {
        // console.log("making comment", x);
        return (
            <ActiveCommentSegment  
                key={index}
                clientName={x.clientName}
                id={x.id}
                filter={this.props.sort}
                hasUpvotes={true}
            />
        );
    }

    getActiveComments(){
        let d = DataStore.getSegmentsByClientCode(this.state.clientName, DataStore.getActiveSegment());
        d.sort(function(a, b) {
            return (-1*(new Date(a.modifiedAt) - new Date(b.modifiedAt)));
        });

        if(d[0]) {
            console.log("D", d[0].createdAt);
            if( new Date(d[0].createdAt).getTime() >= (Date.now() - 60*1000) ) {
                var newD = d.shift();
                d.sort(function(a, b) {
                    return (-1*(a.upvotes - b.upvotes));
                });
                d.unshift(newD);
            } else {
                d.sort(function(a, b) {
                    return (-1*(a.upvotes - b.upvotes));
                });
            }
        }
        return d.map(this.makeComment);  
    }

    handleNewCommentChange(e) {
        this.setState({
            newComment: e.target.value,
        })
    }

    componentWillMount() {
        DataStore.on("change", () => {
            this.setState({
                activeSegment: DataStore.getActiveSegment(),
                data: DataStore.getSegmentsByClientCode(this.state.clientName, DataStore.getActiveSegment()),                
            });
        })
    }


    render() {
        return (
            <div>
                <Sidebar
                    clientName = {this.state.clientName}
                    mode = {"paragraphs"}
                    sort = {"date"} 
                    url = {"/#/B/"+this.props.match.params.client}
                />  
                <div
                    className="container-fluid col-md-8"
                    style={{
                        padding: "20px",
                        paddingBottom: "0px",
                    }}
                >
                    <h3 style={{
                        float: "right",
                        color: "lightGrey",
                    }}>{this.state.mode} </h3>
                    <h3> <i className="fa fa-user-circle-o" aria-hidden="true"></i> {this.props.match.params.client} </h3>
                    <br/>
                    <div
                        style={{
                            padding: "20px",
                            margin: "-20px",
                            maxHeight: "590px",
                            overflowY: "scroll",
                        }}
                    >
                        {this.getActiveComments()}
                    </div>
                </div>
                <div
                    className="container col-md-8 panel"
                    style={{
                        padding: "20px",
                        paddingTop: "0px",
                        position: "absolute",
                        bottom: "0",
                        right: "0",
                    }}
                >   
                    <textarea 
                        className="col-md-12"
                        rows="10"
                        placeholder={"Your message" + (DataStore.getActiveSegment() ? (" about " + DataStore.getActiveSegment()): "")}
                        value={this.state.newComment}
                        onChange={this.handleNewCommentChange}
                    />
                    <button 
                        type="button" 
                        className="btn btn-large btn-primary"
                        onClick={()=> {
                            if(this.state.newComment) {
                                DataStore.addSegment({
                                    clientName: this.state.clientName,
                                    createdAt: Date.now(),
                                    modifiedAt: Date.now(),
                                    upvotes: 0,
                                    code: DataStore.getActiveSegment(),
                                    comment: this.state.newComment,
                                    id: UUID(),
                                    userCreated: true,
                                })
                            }
                            
                        }}
                        style={{
                            marginTop: "20px"
                        }}
                    >Submit</button>  
                </div>
            </div>
        );
    }
}