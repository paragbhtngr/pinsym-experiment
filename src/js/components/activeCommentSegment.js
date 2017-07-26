import React from "react";
import Moment from "react-moment";
import DataStore from "../stores/DataStore";

export default class ActiveCommentSegment extends React.Component {
    constructor(props) {
        super()
        this.state = {
            clientName: props.clientName,
            data: DataStore.getSegmentsByID(props.id)[0],
        };
    }

    componentWillMount() {
        DataStore.on("change", () => {
            this.setState({
                data: DataStore.getSegmentsByID(this.props.id)[0],                
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
                >{DataStore.getSegmentsByID(this.props.id)[0].upvotes}</span>
            )
            var upvoteButton = (
                <button 
                    type="button" 
                    className="btn btn-large btn-success"
                    ref={"upvotebtn"+this.props.id}
                    disabled={DataStore.getSegmentsByID(this.props.id)[0].upvoted? true:false}
                    onClick={ ()=> {
                        DataStore.upvoteSegment(this.props.id);
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
                }}><Moment format="DD/MM/YYYY h:mm a">{DataStore.getSegmentsByID(this.props.id)[0].createdAt}</Moment></h4>
                {upvoteBadge}
                <p style={{
                    marginTop: "10px"
                }}>{DataStore.getSegmentsByID(this.props.id)[0].comment}</p>
                {upvoteButton}
            </div>
        );
    }
}

