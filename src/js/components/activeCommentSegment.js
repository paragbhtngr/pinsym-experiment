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
            var upvote = (
                <div
                className="col-md-1" 
                style={{
                    float: "right",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}>
                    <span 
                        className="badge"
                        style={{
                            height: "30px",
                            width: "30px",
                            borderRadius: "200px",
                            fontSize: "24px",
                            marginBottom: "10px",
                        }}
                    >{DataStore.getSegmentsByID(this.props.id)[0].upvotes}</span>
                    <button 
                        type="button" 
                        className="btn btn-sm btn-success"
                        ref={"upvotebtn"+this.props.id}
                        disabled={DataStore.getSegmentsByID(this.props.id)[0].upvoted? true:false}
                        onClick={ ()=> {
                            DataStore.upvoteSegment(this.props.id);
                        }}
                        style={{
                            marginBottom: "20px"
                        }}
                    >Upvote</button>
                </div>
            )
        } else {
            var date = (
                <h4 style={{
                    width: "70%",
                    display: "inline",
                    marginBottom: "10px",
                }}><Moment format="DD/MM/YYYY">{DataStore.getSegmentsByID(this.props.id)[0].createdAt}</Moment></h4>
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
                {date}

                <div
                    className="col-md-11"
                    style={{
                        paddingLeft:"0"
                    }}
                >
                    <p style={{
                    }}>{DataStore.getSegmentsByID(this.props.id)[0].comment}</p>
                </div>

                {upvote}
            </div>
        );
    }
}

