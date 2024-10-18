const {
  listConfessions,
  createConfession,
} = require("../model/confessions.js");
const { Layout } = require("../templates.js");
const { getSession } = require("../model/session.js");

function get(req, res) {
  const sid = req.signedCookies.sid;
  const session = getSession(sid);
  const user_id = session && session.user_id;
  const page_owner = Number(req.params.user_id);
  if (user_id === page_owner) {
    const confessions = listConfessions(req.params.user_id);
    const title = "Your secrets";
    const content = /*html*/ `
      <div class="Cover">
        <h1>${title}</h1>
        <form method="POST" class="Stack" style="--gap: 0.5rem">
          <textarea name="content" aria-label="your confession" rows="4" cols="30" style="resize: vertical"></textarea>
          <button class="Button">Confess 🤫</button>
        </form>
        <ul class="Center Stack">
          ${confessions
            .map(
              (entry) => `
              <li>
                <h2>${entry.created_at}</h2>
                <p>${entry.content}</p>
              </li>
              `
            )
            .join("")}
        </ul>
      </div>
    `;
    const body = Layout({ title, content });
    res.send(body);
  } else {
    return res.status(401).send("<h1>You are very naughty</h1>");
  }
}

function post(req, res) {
  const sid = req.signedCookies.sid;
  const session = getSession(sid);
  if (session) {
    const user_id = session.user_id;
    createConfession(req.body.content, user_id);
    res.redirect(`/confessions/${user_id}`);
  } else {
    return res.status(401).send("<h1>You are very naughty</h1>");
  }
}

module.exports = { get, post };
