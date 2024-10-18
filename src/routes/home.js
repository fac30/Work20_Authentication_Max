const { Layout } = require("../templates.js");
const { getSession } = require("../model/session.js");

function get(req, res) {
  const sid = request.signedCookies.sid;
  const session = getSession(sid);
  const title = "Confess your secrets!";
  const content = /*html*/ `
    <div class="Cover">
      <h1>${title}</h1>
      ${session?
        '<form method="POST" action="/log-out"><button class="Button">Log out</button></form>':
        '<nav><a href="/sign-up">Sign up</a> or <a href="/log-in">log in</a></nav>'
      }
    </div>
  `;
  const body = Layout({ title, content });
  res.send(body);
}

module.exports = { get };
