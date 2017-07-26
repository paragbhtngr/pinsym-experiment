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
        if(this.props.hasUpvotes){
            var upvoteBadge = (
                <span 
                    className="badge"
                    style={{
                        float: "right",
                    }}
                >{DataStore.getParagraphsByID(this.props.id)[0].upvotes}</span>
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
                }}><Moment format="DD/MM/YYYY h:mm a">{DataStore.getParagraphsByID(this.props.id)[0].createdAt}</Moment></h4>
                {upvoteBadge}
                <p style={{
                    marginTop: "10px"
                }}>{DataStore.getParagraphsByID(this.props.id)[0].comment}</p>
            </div>
        );
    }
}

