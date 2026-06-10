import db from "../db.js";

const createUser = db.prepare(
  `INSERT INTO users (username, password, saving) VALUES (@username, @password, @saving)`
);
const findUserByUsername = db.prepare(
  `SELECT id, username, password, saving FROM users WHERE username = ?`
);
const findUserById = db.prepare(
  `SELECT id, username, password, saving FROM users WHERE id = ?`
);
const getAllUsers = db.prepare(`SELECT id, username, password, saving FROM users`);
const updateUserSaving = db.prepare(`UPDATE users SET saving = ? WHERE id = ?`);
const deleteUserById = db.prepare(`DELETE FROM users WHERE id = ?`);

export const User = {
  create(data) {
    const info = createUser.run({
      username: data.username,
      password: data.password,
      saving: data.saving ?? 0,
    });

    return findUserById.get(info.lastInsertRowid);
  },
  findOneByUsername(username) {
    return findUserByUsername.get(username);
  },
  findById(id) {
    return findUserById.get(id);
  },
  findAll() {
    return getAllUsers.all();
  },
  updateSaving(id, saving) {
    updateUserSaving.run(saving, id);
    return findUserById.get(id);
  },
  deleteById(id) {
    deleteUserById.run(id);
  },
};

export default User;
