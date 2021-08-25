import './App.css';
import CritList, { getFishData,getBugsData,getSeaData,getArtData } from './components/fishes';




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
    </div>
  );
}

export default App;
