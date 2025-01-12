from fastapi import FastAPI, WebSocket
import asyncio
import random

app = FastAPI()

game_state = {
    "player1": {"y": 50, "score": 0},
    "player2": {"y": 50, "score": 0},
    "ball": {"x": 50, "y": 80, "dx": 1, "dy": 1}, # x and y are the ball's velocity, dx and dy are the change in the ball's velocity.
    "obstacles": [{"x": random.randint(20, 80), "y": random.randint(20, 80)} for _ in range(2)]
}

connected_clients = []

async def update_game_state():
    while True:
        # Update the ball's position based on getting the game state.
        ball = game_state["ball"]
        ball["x"] += ball["dx"]
        ball["y"] += ball["dy"]

        # Bounce the ball on walls.
        if ball["y"] <= 0 or ball["y"] >= 100:
            ball["dy"] *= -1

        # Check if the paddle is colliding with the ball.
        if (ball["x"] <= 5 and game_state["player1"]["y"] <= ball["y"] <= game_state["player1"]["y"] + 20) or \
           (ball["x"] >= 95 and game_state["player2"]["y"] <= ball["y"] <= game_state["player2"]["y"] + 20):
            ball["dx"] *= -1

        # Check for the obstacle colliding with the ball.
        for obstacle in game_state["obstacles"]:
            if abs(ball["x"] - obstacle["x"]) < 5 and abs(ball["y"] - obstacle["y"]) < 5:
                ball["dx"] *= -1
                ball["dy"] *= -1

        # Implement the score if the ball overshoots.
        if ball["x"] <= 0:
            game_state["player2"]["score"] += 1
            reset_ball()
        elif ball["x"] >= 100:
            game_state["player1"]["score"] += 1
            reset_ball()

        # Update the game state to all clients
        for client in connected_clients:
            await client.send_json(game_state)

        await asyncio.sleep(0.03)

def reset_ball():
    game_state["ball"] = {"x": 50, "y": 50, "dx": random.choice([-1, 1]), "dy": random.choice([-1, 1])}

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(update_game_state())

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)  # Add the client to the list of connected clients, based on incoming client connection requests.
    try:
        while True:
            data = await websocket.receive_json()
            player = data["player"]
            direction = data["direction"]
            if player == 1:
                game_state["player1"]["y"] += direction
                game_state["player1"]["y"] = max(0, min(80, game_state["player1"]["y"]))
            elif player == 2:
                game_state["player2"]["y"] += direction
                game_state["player2"]["y"] = max(0, min(80, game_state["player2"]["y"]))
    except Exception:
        connected_clients.remove(websocket) #if one player exits / reloads the game, remove the player from the list of connected clients.
