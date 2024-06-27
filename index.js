const express = require('express');
const app = express();
const fs = require('fs');
const users = require('./MOCK_DATA.json');
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));

///Get apis
app.get('/', (req, res) => {
  res.send('Hello from Home Page');
});

app.get('/about', (req, res) => {
  res.send(`Hello im kashaf`);
});
app.get('/contact', (req, res) => {
  res.send('Hello from Contact Page');
});

app.get('/api/users', (req, res) => {
  return res.json(users);
});
app.get('/users', (req, res) => {
  const html = `
  
  <h1>User Details</h1>
  <table border="1" cellspacing="0" cellpadding="10">
    <thead>
      <tr>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Email</th>
        <th>Gender</th>
      </tr>
    </thead>
    <tbody>
      ${users
        .map(
          (user) => `
        <tr>
          <td>${user.first_name}</td>
          <td>${user.last_name}</td>
          <td>${user.email}</td>
          <td>${user.gender}</td>
        </tr>`
        )
        .join('')}
    </tbody>
  </table>`;
  res.send(html);
});
app.get('/api/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  return res.json(user);
});

//Post apis
app.post('/api/users', (req, res) => {
  const body = req.body;
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
    return res.json({ status: 'success' });
  });
});

//patch

app.patch('/api/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ status: 'error', message: 'User not found' });
  }
  const gotUser = users[userIndex];
  const updatedUser = { ...gotUser, ...body };
  users[userIndex] = updatedUser;

  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Failed to update user data' });
    }
    res.json({ status: 'success', updatedUser });
  });
});

//delete
app.delete('/api/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const data = users.filter((user) => user.id !== parseInt(id));
  const file = JSON.stringify(data);
  fs.writeFile('./MOCK_DATA.json', file, (err) => {
    return res.json('user delete succesfully');
  });
});
app.listen(PORT, () => console.log(`Server Satrted at ${PORT}`));
