import './App.css';
import Web3 from 'web3';
import Navbar from './components/navbar';
import Goals from './components/goals'

function App() {
  const web3 = new Web3(process.env.NODE_ENV === 'production' ? Web3.givenProvider : 'ws://localhost:7545');

  return (
    <div className="App">
      <body>
        <Navbar />
        <Goals />
      </body>
    </div>
  );
}

export default App;
