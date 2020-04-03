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
    if (error) { throw error }
    response.status(200).json(results.rows);
  })
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) { throw error }
    response.status(200).json(results.rows);
  })
};

const createUser = (request, response) => {
  const { name, email, googleId } = request.body;

  pool.query('INSERT INTO users (name, email, id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [name, email, googleId], (error, result) => {
    if (error) { throw error }
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
    if (error) { throw error }
    response.status(200).send(`User deleted with ID: ${id}`);
  })
}

// Socket Requests
const createNewGame = playerId => {
  return pool.query('INSERT INTO games (player_one_id, player_one_team) VALUES ($1, $2) RETURNING id', [playerId, 'Red'])
    .then(results => ({ gameId: results.rows[0].id }))
    .catch(error => {
      console.error(error);
      return error
    });
}

const joinNewGame = (playerId, gameId) => {
  return pool.query('UPDATE games SET player_two_id = $1, player_two_team = $2 WHERE id = $3', [playerId, 'Blue', gameId])
    .then()
    .catch(error => {
      console.error(error);
      return error
    })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  createNewGame,
  joinNewGame
}