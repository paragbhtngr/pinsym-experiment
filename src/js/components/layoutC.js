
import React from "react";
import Sidebar from "./sidebarC";
import Comment from "./comment";
import ActiveCommentSegment from "./activeCommentSegment";
import DataStore from "../stores/DataStore";
import {default as UUID} from "uuid";

export default class Layout extends React.Component {
    constructor(props) {
        super()
        this.state = {
            mode: "C",
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
                hasUpvotes={false}
            />
        );
    }

    getActiveComments(){
        // return DataStore.getSegmentsByClientCode(this.state.clientName, DataStore.getActiveSegment()).map((x) => {
        //     console.log("COMMENT::", x.code);
        //     return (<h1>{x.code}</h1>);
        // });
        let d = DataStore.getSegmentsByClientCode(this.state.clientName, DataStore.getActiveSegment()).sort(function(a, b) {
            return (-1*(new Date(a.modifiedAt) - new Date(b.modifiedAt)));
        });
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
                    <h3> {this.props.match.params.client} </h3>
                    <hr/>
                     {this.getActiveComments()} 
                </div>
                <div
                    className="container col-md-8 panel"
                    style={{
                        padding: "20px",
                        paddingTop: "0px",
                    }}
                >
                    <textarea 
                        className="col-md-12"
                        rows="5"
                        placeholder="Add a comment"
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
                                })
                            }
                            
                        }}
                        style={{
                            marginTop: "20px"
                        }}
                    >Submit Comment</button>  
                </div>
            </div>
        );
    }
}