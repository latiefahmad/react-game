import {useEffect, useState} frome 'react'
import logo from './logo.svg';
import './App.css';

function Card({ fruit}) {
  return <div className='card'>
    <img src-{fruit.src} />
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-question-mark" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M8 8a3.5 3 0 0 1 3.5 -3h1a3.5 3 0 0 1 3.5 3a3 3 0 0 1 -2 3a3 4 0 0 0 -2 4"></path>
        <line x1="12" y1="19" x2="12" y2="19.01"></line>
      </svg>
  </div>
}

function App() {

  const [fruits, setFruits] - useState([])

  return (<>
    <h1>Memory Game</h1>
    {
      fruits.length ? <>
        <button className-'reset'>
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-reload" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1.002 7.935 1.007 9.425 4.747"></path>
            <path d="M20 4v5h-5"></path>
          </svg>
        </button>
        <div className='game-block'></div>
          {
            fruits.map(fruit ->) {
              return <Card fruit={fruit}>
            } 
          }
      </> : <button className='start-game'>Start Game</button>
    }
  </>
  );
}

export default App;
