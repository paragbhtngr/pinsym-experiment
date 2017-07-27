
import React from "react";
import Sidebar from "./sidebarA";
import Comment from "./comment";
import ActiveComment from "./activeComment";
import DataStore from "../stores/DataStore";
import {default as UUID} from "uuid";

export default class Layout extends React.Component {
    constructor(props) {
        super()
        this.state = {
            mode: "6A44F",
            clientName: props.match.params.client,
            activeCommentID: DataStore.getActiveCommentID(),
            data: DataStore.getParagraphsByClient(props.match.params.client),
            newComment: undefined,
        };

        this.getActiveCommentByID = this.getActiveCommentByID.bind(this);
        this.handleNewCommentChange = this.handleNewCommentChange.bind(this);
    }

    getActiveCommentByID(commentID) {
        return this.state.data.filter(function (el) {
            return el.id === commentID;
        });
    }

    handleNewCommentChange(e) {
        this.setState({
            newComment: e.target.value,
        })
    }

    componentWillMount() {
        DataStore.on("change", () => {
            this.setState({
                activeCommentID: DataStore.getActiveCommentID(),
                data: DataStore.getParagraphsByClient(this.state.clientName),                
            })
        })
    }


    render() {
        console.log("LAYOUT DATA:", this.state.activeCommentID);
        if(this.state.activeCommentID) {
            let commentData = DataStore.getParagraphsByID(this.state.activeCommentID)[0];
            console.log("active Comment:", commentData);
            var activeComment = (
                <ActiveComment  
                    clientName={commentData.clientName}
                    value={commentData.comment}
                    created={commentData.createdAt}
                    modified={commentData.modifiedAt}
                    upvotes={commentData.upvotes}
                    id={commentData.id}
                    style={{

                    }}
                />
            );
        }
        return (
            <div>
                <Sidebar
                    clientName = {this.state.clientName}
                    mode = {"paragraphs"}
                    sort = {"date"} 
                    url = {"/#/A/"+this.props.match.params.client}
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
                        {activeComment}
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
                    <br/>
                    <textarea 
                        className="col-md-12"
                        rows="10"
                        placeholder="Your message to future volunteers"
                        value={this.state.newComment}
                        onChange={this.handleNewCommentChange}
                    />
                    <button 
                        type="button" 
                        className="btn btn-large btn-primary"
                        onClick={()=> {
                            if(this.state.newComment) {
                                DataStore.addParagraph({
                                    clientName: this.state.clientName,
                                    createdAt: Date.now(),
                                    modifiedAt: Date.now(),
                                    upvotes: 0,
                                    comment: this.state.newComment,
                                    id: UUID(),
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