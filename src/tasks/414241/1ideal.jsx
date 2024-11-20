import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const runOptions = [1, 2, 3, 4, 6];

export default function App() {
  const [gameStage, setGameStage] = useState("toss");
  const [tossWinner, setTossWinner] = useState(null);
  const [batting, setBatting] = useState(null);
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [userWickets, setUserWickets] = useState(0);
  const [computerWickets, setComputerWickets] = useState(0);
  const [currentOver, setCurrentOver] = useState([]);

  const handleToss = (choice) => {
    const result = Math.random() < 0.5 ? "heads" : "tails";
    const userWon = choice === result;
    setTossWinner(userWon ? "user" : "computer");
    if (!userWon) {
      const computerChoice = Math.random() < 0.5 ? "bat" : "bowl";
      setBatting(computerChoice === "bat" ? "computer" : "user");
      setGameStage("play");
    }
  };

  const handleBattingChoice = (choice) => {
    setBatting(choice === "bat" ? "user" : "computer");
    setGameStage("play");
  };

  const playBall = (userChoice) => {
    const computerChoice = runOptions[Math.floor(Math.random() * runOptions.length)];
    let run = 0;
    let isWicket = false;

    if (batting === "user") {
      if (userChoice === computerChoice) {
        isWicket = true;
        setUserWickets(userWickets + 1);
      } else {
        run = userChoice;
        setUserScore(userScore + run);
      }
    } else {
      if (userChoice === computerChoice) {
        isWicket = true;
        setComputerWickets(computerWickets + 1);
      } else {
        run = computerChoice;
        setComputerScore(computerScore + run);
      }
    }

    setCurrentOver([...currentOver, isWicket ? "W" : run]);

    if (currentOver.length === 5 || isWicket) {
      if (batting === "user" && (currentOver.length === 5 || userWickets === 1)) {
        setBatting("computer");
        setCurrentOver([]);
      } else if (batting === "computer" && (currentOver.length === 5 || computerWickets === 1)) {
        setGameStage("result");
      }
    }
  };

  const renderTossCard = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Coin Toss</CardTitle>
      </CardHeader>
      <CardContent>
        {!tossWinner ? (
          <>
            <p className="mb-4">Choose heads or tails:</p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => handleToss("heads")}>Heads</Button>
              <Button onClick={() => handleToss("tails")}>Tails</Button>
            </div>
          </>
        ) : tossWinner === "user" ? (
          <>
            <p className="mb-4">You won the toss! Choose to bat or bowl:</p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => handleBattingChoice("bat")}>Bat</Button>
              <Button onClick={() => handleBattingChoice("bowl")}>Bowl</Button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-4">Computer won the toss and chose to {batting === "computer" ? "bat" : "bowl"}.</p>
            <Button onClick={() => setGameStage("play")}>Next</Button>
          </>
        )}
      </CardContent>
    </Card>
  );

  const renderPlayCard = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{batting === "user" ? "You are batting" : "Computer is batting"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <div>User: {userScore}/{userWickets}</div>
          <div>Computer: {computerScore}/{computerWickets}</div>
        </div>
        <div className="mb-4">
          {currentOver.map((ball, index) => (
            <div key={index}>
              Ball {index + 1}: {ball}
            </div>
          ))}
        </div>
        <p className="mb-2">{batting === "user" ? "Pick a run:" : "Guess a run:"}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {runOptions.map((run) => (
            <Button key={run} onClick={() => playBall(run)}>
              {run}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderResultCard = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Game Result</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2">User: {userScore}/{userWickets}</p>
        <p className="mb-2">Computer: {computerScore}/{computerWickets}</p>
        <p className="font-bold">
          {userScore > computerScore
            ? "You win!"
            : userScore < computerScore
            ? "Computer wins!"
            : "It's a tie!"}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {gameStage === "toss" && renderTossCard()}
      {gameStage === "play" && renderPlayCard()}
      {gameStage === "result" && renderResultCard()}
    </div>
  );
}