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
            data: DataStore.getParagraphsByClient(props.clientName).sort(function(a, b) {
                return (-1*(a.upvotes - b.upvotes));
            }),
        }
    }

    componentWillMount() {
        DataStore.on("change", () => {
            var d = DataStore.getParagraphsByClient(this.state.clientName);
            d.sort(function(a, b) {
                return (-1*(new Date(a.modifiedAt) - new Date(b.modifiedAt)));
            });

            if(d[0]) {
                // console.log("D", d[0].createdAt);
                if( new Date(d[0].createdAt).getTime() >= (Date.now() - 60*1000) ) {
                    var newD = d.shift();
                    d.sort(function(a, b) {
                        return (-1*(a.upvotes - b.upvotes));
                    });
                    d.unshift(newD);
                } else {
                    d.sort(function(a, b) {
                        return (-1*(a.upvotes - b.upvotes));
                    });
                }
            }

            this.setState({
                activeCommentID: DataStore.getActiveCommentID(),
                data: d,                
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
                        userCreated={this.props.userCreated}
                    />
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
                <h4>Messages from previous volunteers</h4>
                <br/>
                <p>Most Upvoted</p>
                {this.state.data.map(makeComment)}
            </div>
        );
    }
}

