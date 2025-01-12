import React, { useEffect, useState } from "react";

const App = () => {
  const [gameState, setGameState] = useState(null); // Holds the game state from the backend
  const [ws, setWs] = useState(null); // WebSocket connection

  useEffect(() => {
    // Establish WebSocket connection
    const socket = new WebSocket("ws://localhost:8000/ws");
    setWs(socket);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data); // Parse game state
      setGameState(data);
    };

    return () => socket.close(); // Cleanup WebSocket on component unmount
  }, []);

  const handleKeyPress = (e) => {
    if (!ws) return;

    let player, direction;
    if (e.key === "w") {
      player = 1; // Player 1 moves up
      direction = -5;
    } else if (e.key === "s") {
      player = 1; // Player 1 moves down
      direction = 5;
    } else if (e.key === "ArrowUp") {
      player = 2; // Player 2 moves up
      direction = -5;
    } else if (e.key === "ArrowDown") {
      player = 2; // Player 2 moves down
      direction = 5;
    }

    if (player && direction !== undefined) {
      ws.send(JSON.stringify({ player, direction })); // Send movement to backend
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress); // Listen for key presses
    return () => window.removeEventListener("keydown", handleKeyPress); // Cleanup listener
  }, [ws]);

  if (!gameState) return <div>Loading...</div>;

  return (
    <div className="w-screen h-screen bg-gray-800 flex items-center justify-center relative overflow-hidden">
      {/* Ball */}
      <div
        className="bg-white w-4 h-4 absolute rounded-full"
        style={{
          top: `${gameState.ball.y}%`,
          left: `${gameState.ball.x}%`,
          transform: "translate(-50%, -50%)",
        }}
      ></div>

      {/* Player 1 Paddle */}
      <div
        className="bg-blue-300 w-4 h-20 absolute"
        style={{
          top: `${gameState.player1.y}%`,
          left: "2%",
          transform: "translateY(-50%)",
        }}
      ></div>

      {/* Player 2 Paddle */}
      <div
        className="bg-red-600 w-4 h-20 absolute"
        style={{
          top: `${gameState.player2.y}%`,
          right: "2%",
          transform: "translateY(-50%)",
        }}
      ></div>

      {/* Obstacles */}
      {gameState.obstacles.map((obs, index) => (
        <div
          key={index}
          className="bg-green-800 w-8 h-8 absolute"
          style={{
            top: `${obs.y}%`,
            left: `${obs.x}%`,
            transform: "translate(-50%, -50%)",
          }}
        ></div>
      ))}

      {/* Scores */}
      <div className="absolute top-4 left-4 text-white text-lg">
        Player 1 Score: {gameState.player1.score}
      </div>
      <div className="absolute top-4 right-4 text-white text-lg">
        Player 2 Score: {gameState.player2.score}
      </div>
    </div>
  );
};

export default App;
