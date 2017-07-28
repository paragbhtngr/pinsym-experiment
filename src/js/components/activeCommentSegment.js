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
        if(!DataStore.getSegmentsByID(this.props.id)[0].userCreated) {
            var upvoteButton = (
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
            )
        }
        if(this.props.hasUpvotes){
            var upvote = (
                <div
                style={{
                    float: "right",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingLeft: "50px",
                }}>
                    <span 
                        className="badge"
                        style={{
                            height: "30px",
                            borderRadius: "250px",
                            fontSize: "14px",
                            paddingTop: "8px",
                            paddingLeft: "20px",
                            paddingRight: "20px",
                            marginBottom: "10px",
                        }}
                    >{DataStore.getSegmentsByID(this.props.id)[0].upvotes} Upvotes</span>
                    {upvoteButton}
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
                    display: "flex",
                }}
            >
                <br/>
                <div
                    style={{
                        paddingLeft:"0",
                        flexGrow: 1,
                    }}
                >   
                    {date}
                    <p style={{
                        wordBreak: "break-word",
                    }}>{DataStore.getSegmentsByID(this.props.id)[0].comment.split('\n').map((item, key) => {
                        return <span key={key}>{item}<br/></span>
                    })}</p>
                </div>

                {upvote}
            </div>
        );
    }
}

