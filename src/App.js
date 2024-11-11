import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [gameResult, setGameResult] = useState('');
  const [games, setGames] = useState([]);
  const winningScore = 10;

  // Função para fazer a requisição de salvar o jogo
  const saveGame = async (playerScore, computerScore, winner) => {
    try {
      const response = await fetch('http://localhost:3000/game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerScore,
          computerScore,
          winner,
        }),
      });
      const data = await response.json();
      console.log('Jogo salvo:', data);
    } catch (error) {
      console.error('Erro ao salvar o jogo:', error);
    }
  };

  // Função para iniciar o jogo
  const playGame = (playerChoice) => {
    const choices = ['pedra', 'papel', 'tesoura'];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    const result = getResult(playerChoice, computerChoice);
    updateScore(result);
    displayResult(playerChoice, computerChoice, result);
  };

  // Função para calcular o resultado
  const getResult = (playerChoice, computerChoice) => {
    if (playerChoice === computerChoice) {
      return 'Empate';
    }
    if (
      (playerChoice === 'pedra' && computerChoice === 'tesoura') ||
      (playerChoice === 'papel' && computerChoice === 'pedra') ||
      (playerChoice === 'tesoura' && computerChoice === 'papel')
    ) {
      return 'Você ganhou';
    }
    return 'Você perdeu';
  };

  // Atualiza a pontuação
  const updateScore = (result) => {
    setPlayerScore(prevScore => {
      let newScore = prevScore;
      if (result === 'Você ganhou') {
        newScore += 1;
      }
      if (newScore === winningScore) {
        saveGame(newScore, computerScore, 'player');
        alert('Você venceu! Jogo terminado.');
        resetGame();
      }
      return newScore;
    });
    
    setComputerScore(prevScore => {
      let newScore = prevScore;
      if (result === 'Você perdeu') {
        newScore += 1;
      }
      if (newScore === winningScore) {
        saveGame(playerScore, newScore, 'computer');
        alert('Computador venceu! Jogo terminado.');
        resetGame();
      }
      return newScore;
    });
  };

  // Reseta o jogo
  const resetGame = () => {
    setPlayerScore(0);
    setComputerScore(0);
  };

  // Exibe o resultado
  const displayResult = (playerChoice, computerChoice, result) => {
    setGameResult(
      `Você escolheu ${playerChoice}. O computador escolheu ${computerChoice}. Resultado: ${result}`
    );
  };

  return (
    <div className="container">
      <header>
        <h1>Jogo de Pedra, Papel e Tesoura</h1>
      </header>

      <main>
        <div className="game-container">
          <div className="options">
            <button onClick={() => playGame('pedra')} aria-label="Pedra">🗿 Pedra</button>
            <button onClick={() => playGame('papel')} aria-label="Papel">📄 Papel</button>
            <button onClick={() => playGame('tesoura')} aria-label="Tesoura">✂️ Tesoura</button>
          </div>
          <div id="result">{gameResult}</div>
        </div>
      </main>

      <aside>
        <h2>Instruções</h2>
        <ul>
          <li>🗿 Pedra quebra ✂️ Tesoura</li>
          <li>📄 Papel cobre 🗿 Pedra</li>
          <li>✂️ Tesoura corta 📄 Papel</li>
        </ul>
      </aside>

      <footer>
        <p>&copy; 2024 Jogo de Pedra, Papel e Tesoura</p>
      </footer>

      <div className="scoreboard" id="scoreboard">
        <p>Jogador: {playerScore}</p>
        <p>Computador: {computerScore}</p>
      </div>
    </div>
  );
}

export default App;
