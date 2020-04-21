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
const createNewGame = (playerId, playerUserName, team = 'red') => {
  // TODO fix this, it's gross
  const userName = team === 'red' ? 'red_player_name' : 'blue_player_name';
  const userId = team === 'red' ? 'red_player_id' : 'blue_player_id';
  const key = team === 'red' ? 'redPlayerName' : 'bluePlayerName';

  return pool.query(`INSERT INTO games (${userId}, ${userName}) VALUES ($1, $2) RETURNING id`, [playerId, playerUserName])
    .then(results => {
      const { id } = results.rows[0];
      return { 
        gameId: id,
        [key]: playerUserName
      }
    })
    .catch(error => {
      throw error
    });
  };

const joinGame = (playerId, playerUserName, gameId) => pool.query('SELECT * FROM games WHERE id = $1', [gameId])
    .then(results => {
      const gameExists = results.rows && results.rows.length !== 0;
      const data = results.rows[0];
      const playerAssignedToTeam = gameExists && data.red_player_id === playerId || data.blue_player_id === playerId;
      if (!gameExists) {
        return { action: 'gameDoesNotExist' }
      }
      if (playerAssignedToTeam) {
        return { 
          action: 'joinedGameInProgress',
          bluePlayerName: data['blue_player_name'],
          redPlayerName: data['red_player_name'],
          gameId
        }
      }
      // TODO: defaults to red, need to finish
      const playerOneTeam = 'red'
      const opponentsUserName = data.red_player_name;

      return joinNewGame(playerId, playerUserName, gameId, opponentsUserName);
    });

const joinNewGame = (playerId, playerUserName, gameId,  opponentsUserName, opponentsTeam = 'red') => {
  // TODO fix this, it's gross
  const userName = opponentsTeam === 'blue' ? 'red_player_name' : 'blue_player_name';
  const userId = opponentsTeam === 'blue' ? 'red_player_id' : 'blue_player_id';
  const key = opponentsTeam === 'blue' ? 'redPlayerName' : 'bluePlayerName';
  const opponentsKey = opponentsTeam === 'blue' ? 'bluePlayerName' : 'redPlayerName'
  return pool.query(`UPDATE games SET ${userId} = $1, ${userName} = $2 WHERE id = $3`, [playerId, playerUserName, gameId])
    .then(() => ({ 
      action: 'joinedNewGame',
      [key]: playerUserName,
      [opponentsKey]: opponentsUserName,
      gameId
    }))
    .catch(error => {
      throw error
    });
  };

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  createNewGame,
  joinGame
}