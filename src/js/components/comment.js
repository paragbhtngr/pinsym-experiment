import React from "react";
import Moment from "react-moment";
import DataStore from "../stores/DataStore";

export default class Comment extends React.Component {
    constructor(props) {
        super()
        this.state = {
            clientName: props.clientName,
            id: props.id,
            data: DataStore.getParagraphsByID(props.id)[0],
        };
    }

    componentWillMount() {
        DataStore.on("change", () => {
            this.setState({
                data: DataStore.getParagraphsByID(this.props.id)[0],
            })
        })
    }

    render() {
        if(DataStore.getActiveCommentID() === this.props.id) {
            var isActiveComment = true;
        }

        if(this.props.hasUpvotes){
            var upvoteBadge = (
                <span 
                    className="badge"
                    style={{
                        marginBottom: "10px",
                        background: isActiveComment? "#1976d2" : "lightGrey",
                    }}
                >
                    {" " + DataStore.getParagraphsByID(this.props.id)[0].upvotes + " "} 
                    Upvotes
                </span>
            )
        } else {
            var date = (
                <h5 style={{
                    width: "70%",
                    display: "inline",
                    marginBottom: "10px",
                    fontWeight: "bold",
                    color: isActiveComment? "#1976d2":"grey",
                }}><Moment format="DD/MM/YYYY">{DataStore.getParagraphsByID(this.props.id)[0].createdAt}</Moment></h5>
            )
        }
        console.log("THIS COMMENT", this);
        return ( 
            <div
                className="container panel panel-default"
                style={{
                    width: "100%",
                    paddingTop: "10px",
                    color: isActiveComment? "black":"grey",
                }}
            >
                {date}
                <p style={{
                    width: "95%",
                }}>{DataStore.getParagraphsByID(this.props.id)[0].comment.substr(0,150) + "..."}</p>
                {upvoteBadge}
            </div>
        );
    }
}

