import React, { Component } from 'react'
import { CritItem, renderMusicItem, renderArtItem, renderCritterItem } from './CritItem';


Storage.prototype.save = function (
    id, obj
) {
    localStorage.setItem(id, JSON.stringify(obj));
}

Storage.prototype.load = function (
    id, fallback
) {
    const val = localStorage.getItem(id);
    if (val === null) {
        if (fallback) {
            this.save(id, fallback);
            return fallback;
        }
        return null;
    } else {
        //console.log(val)
        return JSON.parse(val);
    }
}

const baseurl = "https://acnhapi.com/v1/"

async function getJSON(what) {
    const resp = await fetch(baseurl + what);
    return await resp.json();
}

function createList(T, json, what, renderFunc) {

    let items = [];
    let created = [];
    for (const [, data] of Object.entries(json)) {
        let item = new T(what, data);
        item.save();
        items.push(item);
        created.push(item.getID());
    }
    localStorage.save(what, created, renderFunc);

    return items;

}

export async function getFishData() {
    return getData(CritItem, "fish", "fishes", renderCritterItem);
}


export async function getBugsData() {
    return getData(CritItem, "bugs", "bugses", renderCritterItem);
}

export async function getSeaData() {
    return getData(CritItem, "sea", "seaCreatures", renderCritterItem);
}


export async function getMusicData() {
    return getData(CritItem, "songs", "songses", renderMusicItem);
}


export async function getArtData() {
    return getData(CritItem, "art", "arts", renderArtItem);
}

async function getData(T, what, plural, renderMethod) {
    const prev = localStorage.load(plural);
    if (prev !== null) {
        return prev.map(id => T.load(id, renderMethod))
    } else {
        return createList(T, await getJSON(what), plural, renderMethod);
    }
}

class CritItemComp extends Component {


    constructor(props) {
        super(props);
        const { item } = this.props;
        this.item = item;
        this.state = {
            found: item.found === true
        }
    }

    togleState() {
        const newState = this.state.found === false;
        this.item.found = newState;
        this.item.save();
        this.setState({
            found: newState
        })
    }

    render() {
        return (
            <div className={this.item.type + " critipedia_item "}
                onClick={() => this.togleState()}
            >
                <div className="inner">
                    {this.item.renderInner()}
                </div>
            </div>
        )
    }
}



export default class CritList extends Component {
    constructor(props) {
        super(props);
        const { dataLoader } = this.props;
        this.dataLoader = dataLoader;
        this.state = {
            items: []
        }
    }

    componentDidMount() {
        this.dataLoader().then(
            (items) => {
                this.setState({ items: items });
            }
        )
    }

    render() {

        var first = this.state.items[0];
        var type = first !== undefined ? first.type+"_list" : "";

        const items = this.state.items.map((item) =>
            <CritItemComp key={item.data.id} item={item} />
        )


        return (
            <div id="items" className={type + " critipedia_content"}>
                {items}
            </div>
        )
    }
}
