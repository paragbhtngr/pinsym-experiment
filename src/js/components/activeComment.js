import React from "react";
import Moment from "react-moment";
import DataStore from "../stores/DataStore";

export default class ActiveComment extends React.Component {
    constructor(props) {
        super()
        this.state = {
            clientName: props.clientName,
            id: DataStore.getActiveCommentID(),
            data: DataStore.getParagraphsByID(props.id)[0],
        };
    }

    componentWillMount() {
        DataStore.on("change", () => {
            if(DataStore.getParagraphsByID(this.state.id)[0] === this.state.data) {
                console.log("data not changed!");
            }
            this.setState({
                id: DataStore.getActiveCommentID(),
                data: DataStore.getParagraphsByID(DataStore.getActiveCommentID())[0],                
            });
        })
    }

    render() {
        if(this.props.hasUpvotes){
            var upvoteBadge = (
                <span 
                    className="badge"
                    style={{
                        float: "right",
                    }}
                >{this.state.data.upvotes}</span>
            )
            var upvoteButton = (
                <button 
                    type="button" 
                    className="btn btn-large btn-success"
                    ref={"upvotebtn"+this.props.id}
                    disabled={this.state.data.upvoted? true:false}
                    onClick={ ()=> {
                        DataStore.upvoteParagraph(this.props.id);
                        this.refs["upvotebtn"+this.props.id].setAttribute("disabled", "disabled");
                    }}
                    style={{
                        marginBottom: "20px"
                    }}
                >Upvote</button>
            )
        } 
        return ( 
            <div
                className="container panel panel-default"
                style={{
                    width: "100%",
                    paddingTop: "10px",
                }}
            >
                <h4 style={{
                    width: "70%",
                    display: "inline",
                }}><Moment format="DD/MM/YYYY h:mm a">{this.state.data.createdAt}</Moment></h4>
                {upvoteBadge}
                <p style={{
                    marginTop: "10px"
                }}>{this.state.data.comment}</p>
                {upvoteButton}
            </div>
        );
    }
}

