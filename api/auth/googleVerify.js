const { OAuth2Client } = require('google-auth-library');
const googleCredentials = require('../application-data');

const client = new OAuth2Client(googleCredentials.googleClientId);

const googleVerify = tokenId => new Promise(async (resolve, reject) => {
  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience: googleCredentials.googleClientId
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  userid === userid ?
    resolve() :
    reject()
});

const verifyAuthHttpWrapper = callback => (request, response) => {
  const { authorization: tokenId, userid } = request.headers;
  
  if (!tokenId || !userid) {
    response.sendStatus(400)
  }

  return googleVerify(tokenId)
    .then(callback(request, response))
    .catch((e) => { 
      console.error(e);
      response.sendStatus(401);
    })
}

module.exports = {
  verifyAuthHttpWrapper,
  googleVerify
}
