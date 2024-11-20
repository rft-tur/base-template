import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function App() {
  const [gameState, setGameState] = useState('toss');
  const [userChoice, setUserChoice] = useState('');
  const [tossWinner, setTossWinner] = useState('');
  const [userBats, setUserBats] = useState(null);
  const [userScore, setUserScore] = useState({ runs: 0, wickets: 0 });
  const [computerScore, setComputerScore] = useState({ runs: 0, wickets: 0 });
  const [currentBatsman, setCurrentBatsman] = useState('user');
  const [ball, setBall] = useState(1);

  const coinToss = (choice) => {
    setUserChoice(choice);
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const winner = choice === result ? 'user' : 'computer';
    setTossWinner(winner);
    setGameState(winner === 'user' ? 'chooseBatBowl' : 'computerDecision');
  };

  const chooseBatOrBowl = (choice) => {
    setUserBats(choice === 'bat');
    setGameState(choice === 'bat' ? 'userBatting' : 'userBowling');
  };

  const playBall = (userRun) => {
    let computerRun = Math.floor(Math.random() * 6) + 1;
    if (currentBatsman === 'user') {
      if (userRun === computerRun) {
        setUserScore(prev => ({...prev, wickets: prev.wickets + 1}));
      } else {
        setUserScore(prev => ({...prev, runs: prev.runs + userRun}));
      }
    } else {
      if (userRun === computerRun) {
        setComputerScore(prev => ({...prev, wickets: prev.wickets + 1}));
      } else {
        setComputerScore(prev => ({...prev, runs: prev.runs + computerRun}));
      }
    }
    
    if (ball === 6 || (userScore.wickets === 10 || computerScore.wickets === 10)) {
      if (currentBatsman === 'user') {
        setCurrentBatsman('computer');
        setGameState('computerBatting');
      } else {
        setGameState('result');
      }
      setBall(1);
    } else {
      setBall(ball + 1);
    }
  };

  const resetGame = () => {
    setGameState('toss');
    setUserScore({ runs: 0, wickets: 0 });
    setComputerScore({ runs: 0, wickets: 0 });
    setUserBats(null);
  };

  const GameStage = () => {
    switch(gameState) {
      case 'toss':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Toss</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <p>Choose Heads or Tails</p>
              <div>
                <Button onClick={() => coinToss('heads')}>Heads</Button>
                <Button onClick={() => coinToss('tails')}>Tails</Button>
              </div>
            </CardContent>
          </Card>
        );
      case 'chooseBatBowl':
        return (
          <Card>
            <CardHeader>
              <CardTitle>You Won the Toss!</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <p>Do you want to bat or bowl?</p>
              <div>
                <Button onClick={() => chooseBatOrBowl('bat')}>Bat</Button>
                <Button onClick={() => chooseBatOrBowl('bowl')}>Bowl</Button>
              </div>
            </CardContent>
          </Card>
        );
      case 'computerDecision':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Computer's Decision</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <p>Computer chose to {Math.random() < 0.5 ? 'bat' : 'bowl'}.</p>
              <Button onClick={() => setGameState(userBats === null ? 'userBatting' : (userBats ? 'computerBatting' : 'userBatting'))}>Next</Button>
            </CardContent>
          </Card>
        );
      case 'userBatting':
      case 'computerBatting':
        const isUserBatting = currentBatsman === 'user';
        return (
          <Card>
            <CardHeader>
              <CardTitle>{isUserBatting ? 'Your Turn to Bat' : 'Computer Batting'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-center">
                <div>{userScore.runs}/{userScore.wickets} vs {computerScore.runs}/{computerScore.wickets}</div>
                <div>{ball > 1 ? `${ball - 1} ball(s) bowled` : 'First ball'}</div>
              </div>
              <div className="text-center mb-4">{isUserBatting ? "Pick a run" : "Guess a run"}</div>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 6].map(run => (
                  <Button key={run} onClick={() => playBall(run)}>{run}</Button>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      case 'result':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Game Over</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Your Score: {userScore.runs}/{userScore.wickets}</p>
              <p>Computer Score: {computerScore.runs}/{computerScore.wickets}</p>
              <p>{userScore.runs > computerScore.runs ? 'You Win!' : userScore.runs < computerScore.runs ? 'Computer Wins!' : 'It\'s a Tie!'}</p>
              <Button onClick={resetGame}>Play Again</Button>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center p-4">
      <div className="max-w-sm w-full">
        <GameStage />
      </div>
    </div>
  );
}

export default App;