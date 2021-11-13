

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

export class SaveLoadHelper {
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


export class CritItem {
    constructor(type, data, renderFunc) {
        this.type = type;
        this.found = false;
        this.data = data;
        this.renderInner = () => { return renderFunc(this) };
    }

    getID() {
        return this.type + this.data.id;
    }


    static load(id, renderFunc) {
        let loader = new SaveLoadHelper(id);
        let fish = new CritItem();

        fish.type = loader.load("type");
        fish.found = loader.load("state", false);
        fish.data = loader.load("data");
        fish.renderInner = () => { return renderFunc(fish) };
        return fish;
    }


    save() {
        let saver = new SaveLoadHelper(this.getID());
        saver.save("type", this.type);
        saver.save("state", this.found);
        saver.save("data", this.data);
    }

}

export function renderDefaultItem(item) {
    return (
        <div>asdf</div>
    );
}

export function renderCritterItem(item) {
    if (item.found) {
        return (
            <div>
                <img className="critipedia_img" alt="" src={item.data.image_uri} />
            </div>
        )
    } else {
        let now = 0;
        now += item.data.availability["time-array"].includes(curHour) ? 1 : 0;
        const classNames = ["redText", "redText", "orangeText", "greenText"]
        return (
            <div key="{item.type}-item-{item.data.id}">
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



export function renderArtItem(item) {

    if (item.found) {
        return (
            <div className="doneArt musicItem">
                {<img className="critipedia_img" alt="" src={item.data.image_uri} />}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 26 26">
                    <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                </svg>
            <div> {item.data.name["name-USen"]} </div>
            </div>
        )
    } else {
        return (
            <div className={item.data.hasFake ? "redBorder musicItem" : "orangeBorder musicItem"}>
            <img className="critipedia_img" alt="" src={item.data.image_uri} />
            <div> {item.data.name["name-USen"]} </div>
            </div>)

    }
}

export function renderMusicItem(item) {
    console.log(item);
    if (item.found) {
        return (
            <div id="{item.getID()}" className="doneArt musicItem">
                {<img className="critipedia_img" alt="" src={item.data.image_uri} />}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 26 26">
                    <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                </svg>
                <div> {item.data.name["name-USen"]} </div>
            </div>
        )
    } else {
        return (
            <div className="musicItem" id={item.getID()}>
                <img className="critipedia_img" alt="" src={item.data.image_uri} />
                <div> {item.data.name["name-USen"]} </div>
            </div>
        )
    }
}
