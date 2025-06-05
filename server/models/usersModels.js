const usersModel = {
    register: (userData, callback) => {
        const { name, username, email, password } = userData;

        DB.query(
            "INSERT INTO users (name, username, email) VALUES (?, ?, ?)",
            [name, username, email],
            (err, result) => {
                if (err) return callback(err);

                const userId = result.insertId;

                DB.query(
                    "INSERT INTO passwords (user_id, password_hash) VALUES (?, ?)",
                    [userId, password],
                    (err2) => {
                        if (err2) return callback(err2);
                        callback(null, { userId }); 
                    }
                );
            }
        );
    },
    getUserByUsername: (username, callback) => {
        const query = `
            SELECT users.*, passwords.password_hash AS password
            FROM users
            JOIN passwords ON users.id = passwords.user_id
            WHERE users.username = ?
        `;
        DB.query(query, [username], (err, results) => {
            if (err) {
                console.error("SQL ERROR:", err);
                return callback(err);
            }
            if (results.length === 0) return callback(null, null);
            callback(null, results[0]); 
        });
    }
};

export default usersModel;