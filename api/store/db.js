const Pool = require('pg').Pool;
// TODO: move login information to protected config
const pool = new Pool({
  user: 'sol_admin',
  host: 'localhost',
  database: 'sol_api',
  password: 'password',
  port: 5432,
});

// HTTP Requests

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) { console.error(error) }
    response.status(200).json(results.rows);
  })
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) { console.error(error) }
    response.status(200).json(results.rows);
  })
};

const createUser = (request, response) => {
  const { name, email, googleId } = request.body;

  pool.query('INSERT INTO users (name, email, id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [name, email, googleId], (error, result) => {
    if (error) { console.error(error) }
    response.sendStatus(201);
  });
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) { throw error }
      response.status(200).send(`User #${id} updated with name: ${name}, email: ${email}`);
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) { console.error(error) }
    response.status(200).send(`User deleted with ID: ${id}`);
  })
}

// Socket Requests
const createNewGame = (playerId, playerUserName) => pool.query('INSERT INTO games (player_one_id, player_one_user_name, player_one_team) VALUES ($1, $2, $3) RETURNING id', [playerId, playerUserName, 'Red'])
    .then(results => ({ gameId: results.rows[0].id }))
    .catch(error => {
      throw error
    });

const joinGame = (playerId, playerUserName, gameId) => pool.query('SELECT * FROM games WHERE id = $1', [gameId])
    .then(results => {
      const gameExists = results.rows && results.rows.length !== 0;
      const data = results.rows[0];
      const playerAssignedToTeam = gameExists && data.player_one_id === playerId || data.player_two_id === playerId;
      if (!gameExists) {
        return { action: 'gameDoesNotExist' }
      }
      if (playerAssignedToTeam) {
        return { 
          action: 'joinedGameInProgress',
          opponentUserName: data.player_one_user_name
        }
      }
      return joinNewGame(playerId, playerUserName, gameId, data.player_one_user_name);
    });

const joinNewGame = (playerId, playerUserName, gameId, playerOneUserName) => pool.query('UPDATE games SET player_two_id = $1, player_two_user_name = $2, player_two_team = $3 WHERE id = $4', [playerId, playerUserName, 'Blue', gameId])
    .then(results => ({ 
      action: 'joinedNewGame',
      opponentUserName: playerOneUserName
    }))
    .catch(error => {
      throw error
    });

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  createNewGame,
  joinGame
}