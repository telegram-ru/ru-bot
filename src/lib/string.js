module.exports = {
  makeName: ({ first_name: firstName, last_name: lastName }) => `${firstName}${lastName ? ` ${lastName}` : ''}`,
}
