import React, { useRef } from 'react';
import starry from './starry_night.jpg';
import './App.css';
import { FilteredCanvas } from './components'

const App = () => {

  const img = useRef(null)

  return (< div className="App" >
    <header className="App-header">
      <div>original</div>
      <img id="original" ref={img} src={starry}></img>
      <div>filtered</div>
      <FilteredCanvas imageRef={img}></FilteredCanvas>
    </header>
  </div >)
}


export default App;