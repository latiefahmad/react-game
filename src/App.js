import {useEffect, useState} from 'react';
import fruitItems from "./fruits.json"
import Confetti from './Confetti';
import './App.css';

function Card({fruit, flipped, chooseCard }) {

  const cardClickHandle = () => {
    chooseCard(fruit)
  };

  return <div className={`card ${flipped ? 'matched' : ''}`} onClick={cardClickHandle}>
    <img style={{transform:'rotateY(180deg)'}} src={fruit.src} alt={fruit.name || 'Memory card'} />
      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-question-mark" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M8 8a3.5 3 0 0 1 3.5 -3h1a3.5 3 0 0 1 3.5 3a3 3 0 0 1 -2 3a3 4 0 0 0 -2 4"></path>
        <line x1="12" y1="19" x2="12" y2="19.01"></line>
      </svg>
  </div>
}

function DifficultySelector({ onSelectDifficulty, currentDifficulty }) {
  const difficulties = [
    { name: 'Mudah', value: 'easy', pairs: 6, time: 60, color: '#4CAF50' },
    { name: 'Sedang', value: 'medium', pairs: 9, time: 45, color: '#FF9800' },
    { name: 'Sulit', value: 'hard', pairs: 12, time: 35, color: '#F44336' },
    { name: 'Ekstrem', value: 'extreme', pairs: 18, time: 25, color: '#9C27B0' }
  ];

  return (
    <div className="difficulty-selector">
      <h2>Pilih Tingkat Kesulitan</h2>
      <div className="difficulty-buttons">
        {difficulties.map(diff => (
          <button 
            key={diff.value}
            className={`difficulty-btn ${currentDifficulty === diff.value ? 'active' : ''}`}
            style={{ backgroundColor: diff.color }}
            onClick={() => onSelectDifficulty(diff)}
          >
            <span className="diff-name">{diff.name}</span>
            <span className="diff-info">{diff.pairs} pasang | {diff.time}s</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function GameStats({ score, moves, timeLeft, difficulty }) {
  return (
    <div className="game-stats">
      <div className="stat">
        <span className="stat-label">Skor:</span>
        <span className="stat-value">{score}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Langkah:</span>
        <span className="stat-value">{moves}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Waktu:</span>
        <span className={`stat-value ${timeLeft <= 10 ? 'warning' : ''}`}>{timeLeft}s</span>
      </div>
      <div className="stat">
        <span className="stat-label">Level:</span>
        <span className="stat-value">{difficulty?.name || '-'}</span>
      </div>
    </div>
  );
}

function App() {

  const [fruits, setFruits] = useState([])
  const [fruitOne, setFruitOne] = useState(null)
  const [FruitTwo, setFruitTwo] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [difficulty, setDifficulty] = useState(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [timer, setTimer] = useState(null)

  const initGame = (selectedDifficulty) => {
    const numPairs = selectedDifficulty.pairs;
    const selectedFruits = fruitItems.slice(0, numPairs);
    const allFruits = [...selectedFruits, ...selectedFruits]
    .sort (() => Math.random() - .5)
    .map(item => ({...item, id: Math.random() }))

    setFruits(allFruits) 
    setDifficulty(selectedDifficulty)
    setGameStarted(true)
    setScore(0)
    setMoves(0)
    setTimeLeft(selectedDifficulty.time)
    setGameOver(false)
    setGameCompleted(false)
    setShowConfetti(false)
  }

  const resetGame = () => {
    setFruits([])
    setFruitOne(null)
    setFruitTwo(null)
    setGameCompleted(false)
    setShowConfetti(false)
    setGameStarted(false)
    setDifficulty(null)
    setScore(0)
    setMoves(0)
    setTimeLeft(0)
    setGameOver(false)
    if (timer) {
      clearInterval(timer)
      setTimer(null)
    }
  }

  const selectDifficulty = (selectedDifficulty) => {
    initGame(selectedDifficulty)
  }

  const chooseCard = (fruit) => {
    if (gameOver || fruit.matched || fruit === fruitOne || fruit === FruitTwo) return;
    
    fruitOne ? setFruitTwo(fruit) : setFruitOne(fruit)
  }

  useEffect(() => {
    if(fruitOne && FruitTwo) {
      setMoves(prev => prev + 1)
      
      if(fruitOne.src === FruitTwo.src){
        setFruits(prevFruits => {
          return prevFruits.map(item => {
            if(item.src === fruitOne.src){
              return { ...item, matched: true}
            }else {
              return item
            }
          })
        })
        
        // Hitung skor berdasarkan waktu tersisa dan tingkat kesulitan
        const timeBonus = Math.max(0, timeLeft * 10)
        const difficultyMultiplier = difficulty?.value === 'easy' ? 1 : 
                                   difficulty?.value === 'medium' ? 2 : 
                                   difficulty?.value === 'hard' ? 3 : 4
        const matchScore = 100 * difficultyMultiplier + timeBonus
        setScore(prev => prev + matchScore)
      }

      setTimeout(() => {
        setFruitOne(null)
        setFruitTwo(null)
      }, 500)
    }
  }, [fruitOne, FruitTwo, timeLeft, difficulty])

  // Check if game is completed
  useEffect(() => {
    if (fruits.length > 0) {
      const allMatched = fruits.every(fruit => fruit.matched);
      if (allMatched && !gameCompleted) {
        setGameCompleted(true);
        setShowConfetti(true);
        if (timer) {
          clearInterval(timer);
          setTimer(null);
        }
        
        // Bonus skor untuk menyelesaikan game
        const completionBonus = timeLeft * 50;
        setScore(prev => prev + completionBonus);
      }
    }
  }, [fruits, gameCompleted, timer, timeLeft])

  // Timer countdown
  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameCompleted && !gameOver) {
      const newTimer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimer(newTimer);
      
      return () => clearInterval(newTimer);
    }
  }, [gameStarted, gameCompleted, gameOver, timeLeft])

  // Clean up timer on game over
  useEffect(() => {
    if (gameOver && timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [gameOver, timer])

  return (
    <div className="app-container">
      <h1>Memory Game</h1>
      
      {!gameStarted ? (
        <DifficultySelector 
          onSelectDifficulty={selectDifficulty}
          currentDifficulty={difficulty?.value}
        />
      ) : (
        <>
          <GameStats 
            score={score}
            moves={moves}
            timeLeft={timeLeft}
            difficulty={difficulty}
          />
          
          {gameOver && !gameCompleted && (
            <div className="game-over">
              <h2>Waktu Habis!</h2>
              <p>Skor Akhir: {score}</p>
              <button onClick={resetGame} className="play-again-btn">Main Lagi</button>
            </div>
          )}
          
          {gameCompleted && (
            <div className="game-completed">
              <h2>Selamat! Game Selesai!</h2>
              <p>Skor Akhir: {score}</p>
              <p>Total Langkah: {moves}</p>
              <button onClick={resetGame} className="play-again-btn">Main Lagi</button>
            </div>
          )}
          
          {fruits.length ? <>
            <button onClick={resetGame} className='reset'>
              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-reload" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1.002 7.935 1.007 9.425 4.747"></path>
              <path d="M20 4v5h-5"></path>
            </svg>
          </button>
          <div className={`game-block ${difficulty?.value}`}>
            {
              fruits.map((fruit, key) => {
                return <Card 
                  key={key}
                  fruit={fruit}
                    chooseCard={chooseCard}
                    flipped={fruit === fruitOne || fruit === FruitTwo || fruit.matched}
                />
              })
            }
          </div>
          </> : null}
        </>
      )}
      
      <Confetti 
        isActive={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      
      <div className='copyright-footer'>
        <div className='circle'></div>
        <span>© 2025 ltfhmd</span>
        <div className='circle'></div>
      </div>
    </div>
  );
}

export default App;
