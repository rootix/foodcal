const faunadb = require('faunadb');

const q = faunadb.query;
const client = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET
});

exports.handler = (event, context, callback) => {
    if (event.httpMethod !== 'POST') {
        return callback(null, { statusCode: 405, body: 'Method Not Allowed' });
    }

    const { username, password } = JSON.parse(event.body);
    client
        .query(q.Login(q.Match(q.Index('usersByEmail'), username), { password }))
        .then(response => {
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify(response.secret)
            });
        })
        .catch(error => {
            console.log(`Login failed for user ${username}`, error.message);
            return callback(null, {
                statusCode: 401,
                body: 'Login failed'
            });
        });
};
