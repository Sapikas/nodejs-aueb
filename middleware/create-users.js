module.exports = (req, res, next) => {
  req.users = {
    usernames: ['sapikas', 'dimitris', 'manolis'],
    passwords: ['1234', '1234', '1234']
  }
  next();
}