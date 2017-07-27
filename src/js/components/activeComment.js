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
        console.log("userCreated", this);
        if(!this.state.data.userCreated){
            var upvoteButton = (
                <button 
                    type="button" 
                    className="btn btn-sm btn-success"
                    ref={"upvotebtn"+this.props.id}
                    disabled={this.state.data.upvoted? true:false}
                    onClick={ ()=> {
                        DataStore.upvoteParagraph(this.props.id);
                        this.refs["upvotebtn"+this.props.id].setAttribute("disabled", "disabled");
                    }}
                    style={{
                        marginBottom: "20px",
                        float: "right"
                    }}
                ><i class="fa fa-thumbs-o-up" aria-hidden="true"></i> Upvote</button>
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
                    >{this.state.data.upvotes} Upvotes</span>
                    {upvoteButton}
                    

                </div>
            )
        } else {
            var date = (
                <h4 style={{
                    width: "70%",
                    display: "inline",
                    marginBottom: "10px",
                }}><Moment format="DD/MM/YYYY">{this.state.data.createdAt}</Moment></h4>
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

                <div 
                    style={{
                        paddingLeft:"0",
                        flexGrow: 1,
                    }}
                >
                    {date}                    
                    <p style={{                      
                    }}>{this.state.data.comment.split('\n').map((item, key) => {
                            return <span key={key}>{item}<br/></span>
                        })}</p>
                </div>
                {upvote}
            </div>
        );
    }
}

