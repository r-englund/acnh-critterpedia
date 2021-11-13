import './App.css';
import CritList, { getFishData,getBugsData,getSeaData,getArtData, getMusicData } from './components/fishes';




function App() {
  return (
    <div className="App">
      <h1>Bugs</h1>
      <CritList dataLoader={getBugsData} />
      <hr />
      <h1>Fishes</h1>
      <CritList dataLoader={getFishData} />
      <hr />
      <h1>Sea Creatures</h1>
      <CritList dataLoader={getSeaData} />
      <hr />
      <h1>Art</h1>
      <CritList dataLoader={getArtData} />
      <h1>Music</h1>
      <CritList dataLoader={getMusicData} />
    </div>
  );
}

export default App;
