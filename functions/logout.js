const faunadb = require('faunadb');

exports.handler = (event, context, callback) => {
    if (event.httpMethod !== 'POST') {
        return callback(null, { statusCode: 405, body: 'Method Not Allowed' });
    }

    const { token } = JSON.parse(event.body);

    const q = faunadb.query;
    const client = new faunadb.Client({
        secret: token
    });
    client
        .query(q.Logout(false))
        .then(_ => {
            return callback(null, {
                statusCode: 200,
                body: 'true'
            });
        })
        .catch(_ => {
            return callback(null, {
                statusCode: 200,
                body: 'false'
            });
        });
};
