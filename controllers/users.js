 const mysql = require('mysql')
const pool = require('../sql/connection')
const { handleSQLError } = require('../sql/error')

const getAllUsers = (req, res) => {
  // SELECT ALL USERS
  pool.query("SELECT users.id, first_name, last_name, phone1 FROM users INNER JOIN usersContact ON users.id = usersContact.user_id", (err, rows) => {
    if (err) return handleSQLError(res, err)
    return res.json(rows);
  })
}

const getUserById = (req, res) => {
  let id = req.params.id
  // SELECT USERS WHERE ID = <REQ PARAMS ID>
  let sql = "SELECT first_name from users INNER JOIN usersContact ON users.id = usersContact.user_id WHERE users.ID = ?"
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [id])

  pool.query(sql, (err, rows) => {
    if (err) return handleSQLError(res, err)
    return res.json(rows);
  })
}

const createUser = (req, res) => {

  //fields for a user = first_name, last_name
  //fields for a userContact = phone1,phone2,email

  let user = req.body.user;
  let userContact = req.body.userContact;

  // INSERT INTO USERS FIRST AND LAST NAME 
  let sql = "INSERT INTO users SET ?"
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [user])

  pool.query(sql,(err, results) => {
    if (err) return handleSQLError(res, err)   

    let user_id = results.insertId;

    userContact['user_id'] = user_id

    let contactSql = "INSERT INTO usersContact SET ?"

    contactSql = mysql.format(contactSql, [userContact])
  
    pool.query(contactSql,(err, results) => {
      if (err) return handleSQLError(res, err)
      
      return res.json({ newId: user_id});
    })
  })
}

const updateUserById = (req, res) => {
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let id = req.params.id;

  // UPDATE USERS AND SET FIRST AND LAST NAME WHERE ID = <REQ PARAMS ID>
  let sql = "UPDATE users SET first_name = ?, last_name = ? WHERE ID = ? "
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [first_name, last_name, id])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.status(204).json();
  })
}

const deleteUserByFirstName = (req, res) => {
  let first_name = req.body.first_name
  // DELETE FROM USERS WHERE FIRST NAME = <REQ PARAMS FIRST_NAME>
  let sql = "DELETE FROM users WHERE first_name = ?"
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [first_name])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ message: `Deleted ${results.affectedRows} user(s)` });
  })
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserByFirstName
}