import './App.css';
import CritList, { getFishData,getBugsData,getSeaData } from './components/fishes';




function App() {
  return (
    <div className="App">
      <h1>Fishes</h1>
      <CritList dataLoader={getFishData} />
      <hr />
      <h1>Bugs</h1>
      <CritList dataLoader={getBugsData} />
      <h1>Sea Creatures</h1>
      <hr />
      <CritList dataLoader={getSeaData} />
    </div>
  );
}

export default App;
