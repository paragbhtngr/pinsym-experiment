import React from "react";
import Comment from "./comment";
import paragraphs from "../data/paragraphs";
import segments from "../data/segments";
import DataStore from "../stores/DataStore";

export default class Sidebar extends React.Component {
    constructor(props) {
        super()
        this.state = {
            clientName: props.clientName,
            data: DataStore.getParagraphsByClient(props.clientName),
        }
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
        let makeComment = (x, index) => {
            return (
                <a
                    onClick={() => {
                        DataStore.setActiveCommentID(x.id);
                    }}
                    style={{
                        textDecoration: "none"
                    }}
                >
                    <Comment  
                        key={index}
                        clientName={x.clientName}
                        value={x.comment}
                        created={x.createdAt}
                        modified={x.modifiedAt}
                        upvotes={x.upvotes}
                        id={x.id}
                        filter={this.props.sort}
                        hasUpvotes={true}
                    />
                </a>   
            );
        }
        let makeCategory = (x, index) => {
            if(DataStore.getActiveSegment() === x) {
                var isActiveSegment = true;
            }
            return (
                <a
                    onClick={() => {
                        DataStore.setActiveSegment(x);
                    }}
                    style={{
                        textDecoration: "none" 
                    }}
                >   
                    <div
                        className="panel"
                        style={{
                            padding: "10px"
                            
                        }}
                    >
                        <h5 
                        style={{
                            color: isActiveSegment? "#1976d2": "grey",
                        }}>{x.toUpperCase()}</h5>
                    </div>                    
                </a>   
            );
        }
        return ( 
            <div
            className="container col-md-4 col-sm-5"
            style={{
                paddingTop: "0px",
                borderRight: "1px solid lightGrey",
                background: "lightGrey",
                height: "102vh",
                overflowY: "scroll",
                paddingTop: "30px",
            }}
            >
                <h4>What previous volunteers want you to know</h4>
                <br/>
                {DataStore.getSegmentNames().map(makeCategory)}
            </div>
        );
    }
}

