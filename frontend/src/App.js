
import { Route } from 'react-router-dom';
import './App.css';
import HomePage from './components/Pages/HomePage';
import Chats from './components/Pages/Chats';

function App() {
  return (
    <div className="App">
    <Route path="/" component={HomePage} exact />
    <Route path="/chats" component={Chats} />
  </div>
  );
}

export default App;
