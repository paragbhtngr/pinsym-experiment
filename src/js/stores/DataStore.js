import { EventEmitter } from "events";
import { Default as UUID } from "uuid";

import Paragraphs from "../data/paragraphs";
import Segments from "../data/segments";
import ClientNames from "../data/clientNames";
import SegmentNames from "../data/segmentNames";

class DataStore extends EventEmitter {
    constructor() {
        super()
        this.paragraphs = Paragraphs.values.sort(function(a, b) {
            return (-1*(new Date(a.modifiedAt) - new Date(b.modifiedAt)));
        });
        this.segments = Segments.values.sort(function(a, b) {
            return (-1*(new Date(a.modifiedAt) - new Date(b.modifiedAt)));
        });
        this.segmentNames = SegmentNames.sort();
        this.clientNames =  ClientNames.sort();
        this.activeCommentID = undefined;
        this.activeSegment = undefined;
    }

    getParagraphs() { return this.paragraphs; }
    getSegments() { return this.segments; }
    getSegmentNames() { return this.segmentNames; }

    getActiveCommentID() { return this.activeCommentID; }
    setActiveCommentID(id) { 
        this.activeCommentID = id; 
        this.emit("change");
    }

    getActiveSegment() { return this.activeSegment; }
    setActiveSegment(segment) { 
        this.activeSegment = segment; 
        this.emit("change");
    }

    getParagraphsByClient(client) {
        return this.paragraphs.filter(function (el) {
            return el.clientName === client;
        });
    }

    getSegmentsByClient(client) {
        return this.segments.filter(function (el) {
            return el.clientName === client;
        });
    }

    getParagraphsByID(id) {
        return this.paragraphs.filter(function (el) {
            return el.id === id;
        });
    }

    getSegmentsByID(id) {
        return this.segments.filter(function (el) {
            return el.id === id;
        });
    }

    getSegmentsByClientCode(client, code) {
        return this.segments.filter(function (el) {
            return el.clientName === client &&
            el.code === code;
        });
    }

    addParagraph(para) {
        console.log("adding paragraph");
        this.paragraphs.push(para);
        this.paragraphs.sort(function(a, b) {
            return (new Date(a.modifiedAt) - new Date(b.modifiedAt));
        });

        console.log(this.getParagraphsByClient(para.clientName));

        this.emit("change");
    }

    addSegment(seg) {
        this.segments.push(seg);
        this.segments.sort(function(a, b) {
            return (new Date(a.modifiedAt) - new Date(b.modifiedAt));
        });

        this.emit("change");
    }

    upvoteParagraph(commentID) {
        console.log("upvoting");
        let p = this.paragraphs.filter(function (el) {
            return el.id === commentID;
        });
        if(p) {
            p[0].upvotes += 1;
            p[0].upvoted = true;
        }

        this.emit("change");
    }
    
    upvoteSegment(commentID) {
        let s = this.segments.filter(function (el) {
            return el.id === commentID;
        });
        if(s) {
            s[0].upvotes += 1;
            s[0].upvoted = true;
        }

        this.emit("change");
    }
}

const DS = new DataStore;

export default DS;