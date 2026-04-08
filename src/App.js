import Game from "./components/Game"
import Pick from "./components/Pick"
import Picked from "./components/Picked"
import {Routes, Route} from "react-router-dom"
import StartPage from "./components/StartPage";

function App(props) {
  
      
  return (
    <>
      <Routes >
        < Route path="/" element={<StartPage/>}/>
          <Route path = "/game" element={<Game/>}/>
          <Route path = "/cards" element={<Pick/>}/>
          <Route path = "/pick" element={<Picked/>}/>
      </Routes> 
    </>
  );
}

export default App;
