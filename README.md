# Real-Time Multiplayer Ping Pong Game

This is a real-time multiplayer ping pong game with dynamic obstacles, developed as part of a take-home assignment. The game allows two players to compete across different browser tabs, featuring dynamic ball movement and obstacle interactions.

---

## **Setup Instructions**

### Prerequisites
1. **Python** (3.8+ recommended)
2. **Node.js** (16+ recommended)
3. A package manager (npm or yarn)

### Backend Setup
1. Clone the repo
   ```bash
   git clone <repository-url>
   cd <repository-folder>/backend
   ```
2. Create and activate the virtual environment-
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use this command instead - `venv\Scripts\activate`
   ```
3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the WebSocket server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the `frontend/ping-pong-game/` directory:
   ```bash
   cd frontend/ping-pong-game
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## **How to Run the Game**
1. Ensure that both the backend and frontend are running-
   - Backend: `http://localhost:8000`
   - Frontend: `http://localhost:5173`
2. Open the frontend URL in two separate browser tabs.
3. Player Controls
   - **Player 1**: Use `W` (up) and `S` (down) keys to move the paddle.
   - **Player 2**: Use the `Arrow Up` and `Arrow Down` keys to move the paddle.
4. Watch the ball bounce off obstacles and paddles. The score increases when the ball goes outside the bounds on the opponent’s side.

---

## **Technical Choices and Decisions made**
1. **Frontend**: Following decisions were made for the frontend part, as we had freedom to choose our own JavaScript Library/Framework.
   - **React with Vite**: As it provides a fast development experience and easy state management, for the dynamic rendering of the gameplay components such as ball and paddle.
   - **Tailwind CSS**: It simplifies styling with classes.
   <br>
2. **Game Mechanics**:
   - Randomized bounce angles enhance the gameplay's unpredictability.

---

## **Known Limitations**
1. **Physics is oversimplified.**
   - The ball and paddle interactions are basic and may not always feel realistic.
   - Collision detection with obstacles lacks advanced handling for edge cases.
   - Gameplay animation is choppy.
   <br>
2. **Error Handling**
   - Limited support for player disconnection or network issues.
   - Players joining mid-game may experience synchronization delays.
   <br>
3. **This is implemented on a single system only.**
   - This will take more changes to make it into a server setup for multiple players competing against each other. Currently this will work only on a single system.

