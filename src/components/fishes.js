import React, { Component } from 'react'


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
        console.log(val)
        return JSON.parse(val);
    }
}

const baseurl = "https://acnhapi.com/v1/"

async function getJSON(what) {
    const resp = await fetch(baseurl + what);
    return await resp.json();
}

function createList(T, json, what) {

    let items = [];
    let created = [];
    for (const [, data] of Object.entries(json)) {
        let item = new T(what, data);
        item.save();
        items.push(item);
        created.push(item.getID());
    }
    localStorage.save(what, created);

    return items;

}

export async function getFishData() {
    return getData(CritItem, "fish", "fishes");
}


export async function getBugsData() {
    return getData(CritItem, "bugs", "bugses");
}

export async function getSeaData() {
    return getData(CritItem, "sea", "seaCreatures");
}



export async function getArtData() {
    return getData(CritItem, "art", "arts");
}

async function getData(T, what, plural) {
    const prev = localStorage.load(plural);
    if (prev !== null) {
        return prev.map(id => T.load(id))
    } else {
        return createList(T, await getJSON(what), plural);
    }
}

class SaveLoadHelper {
    constructor(id) {
        this.id = id;
    }

    save(name, value) {
        localStorage.save(this.id + name, value);
    }

    load(name, defaultValue) {
        return localStorage.load(this.id + name, defaultValue);
    }
}

class CritItem {
    constructor(type, data) {
        this.type = type;
        this.found = false;
        this.data = data;
    }


    // static getID(id) {
    //     return this.type + id;
    // }

    getID() {
        return this.type + this.data.id;
    }


    static load(id) {
        let loader = new SaveLoadHelper(id);
        let fish = new CritItem();

        fish.type = loader.load("type");
        fish.found = loader.load("state", false);
        fish.data = loader.load("data");
        return fish;
    }


    save() {
        let saver = new SaveLoadHelper(this.getID());
        saver.save("type", this.type);
        saver.save("state", this.found);
        saver.save("data", this.data);
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


    renderInner() {
        const MONTHS = [
            "",
            "jan",
            "feb",
            "mar",
            "apr",
            "may",
            "jun",
            "jul",
            "aug",
            "sep",
            "oct",
            "nov",
            "dec"
        ]
        const curMonth = (new Date()).getMonth() + 1;
        const curHour = (new Date()).getHours();

        const { item } = this.props;
        if (this.state.found) {
            if (item.data.hasFake !== undefined) {
                return (
                    <div className="doneArt">
                        {<img className="critipedia_img" alt="" src={item.data.image_uri} />}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                        </svg>
                    </div>
                )
            } else {
                return (
                    <div>
                        <img className="critipedia_img" alt="" src={item.data.icon_uri} />
                    </div>
                )

            }
        } else {
            if (item.data.hasFake !== undefined) {
                return (
                    <div className={item.data.hasFake ? "redBorder" : "orangeBorder"}>
                        <img className="critipedia_img" alt="" src={item.data.image_uri} />
                    </div>)
            } else {

                let now = 0;
                now += item.data.availability["time-array"].includes(curHour) ? 1 : 0;
                const classNames = ["redText", "redText", "orangeText", "greenText"]
                return (
                    <div>
                        {item.data.availability.location},
                        {item.data.availability.rarity}<br />
                        {item.data.shadow}<br />
                        {item.data.availability.time} <br />
                        {item.data.availability["month-array-northern"].map(i => {
                            now += i === curMonth ? 2 : 0;
                            return <span className={i === curMonth ? "greenText" : "redText"}>{MONTHS[i]}</span>
                        }).reduce((prev, curr) => [prev, ', ', curr])} <br />
                        <span style={{ fontSize: "4em" }} className={classNames[now]}>★</span>

                    </div>
                )
            }
        }

    }

    render() {
        return (
            <div className="critipedia_item"
                onClick={() => this.togleState()}
            >
                <div className="inner">
                    {this.renderInner()}
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

        const items = this.state.items.map((fish) =>
            <CritItemComp key={fish.data.id} item={fish} />
        )


        return (
            <div id="items" className="critipedia_content">
                {items}
            </div>
        )
    }
}
