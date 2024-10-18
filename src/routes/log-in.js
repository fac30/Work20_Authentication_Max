const { getUserByEmail } = require("../model/user.js");
const { createSession } = require("../model/session.js");
const { Layout } = require("../templates.js");
const bcrypt = require("bcryptjs");

function get(req, res) {
  const title = "Log in to your account";
  const content = /*html*/ `
    <div class="Cover">
      <h1>${title}</h1>
      <form method="POST" class="Row">
        <div class="Stack" style="--gap: 0.25rem">
          <label for="email">email</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="Stack" style="--gap: 0.25rem">
          <label for="password">password</label>
          <input type="password" id="password" name="password" required>
        </div>
        <button class="Button">Log in</button>
      </form>
    </div>
  `;
  const body = Layout({ title, content });
  res.send(body);
}

function post(req, res) {
  const { email, password } = req.body;
  const user = getUserByEmail(email);
  if (!email || !password || !user) {
    return res.status(400).send("<h1>Login failed</h1>");
  }
  bcrypt.compare(password, user.hash).then(password_check => {
    if (password_check) {
      const sid = createSession(user.id);
      res.cookie('sid', sid, { signed: true, httpOnly: true, maxAge: 1000 * 60, sameSite: "lax" });
      res.redirect(`/confessions/${user.id}`);
    } else {
      return res.status(400).send("<h1>Login failed</h1>");
    }
  });
}

module.exports = { get, post };
