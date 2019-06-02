// @flow

const { STATUS_CODES } = require("http");
const { parse } = require("url");
const micro = require("micro");

const { captureError } = require("../lib/errors");
const { fetch, getPermutations } = require("../lib/vault");

const MAX_TRIES = 10;
const MAX_LEN = 7;

module.exports = micro(async req => {
  // TODO: ratelimit

  try {
    let LENGTH /*: number */ = 4;
    let SEPARATOR = "-";

    const { query } = parse(req.url);

    if (query) {
      if (query.w) {
        LENGTH = Number(query.w);
        if (LENGTH > MAX_LEN) {
          LENGTH = MAX_LEN;
        }
      }

      if (query.sep) {
        [SEPARATOR] = query.sep; // Single character separator
      }
    }

    const SCORE_THRESHOLD = 4; // Zxcvbn maximum

    const passphrase = await fetch(
      MAX_TRIES,
      LENGTH,
      SEPARATOR,
      SCORE_THRESHOLD
    );
    const permutations = getPermutations(LENGTH);

    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Easier, Better Passwords" />

    <title>Pass Plum</title>

    <link rel="icon" href="/static/favicon.ico" />
    <link
      rel="apple-touch-icon"
      sizes="76x76"
      href="/static/touch-icon-ipad.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="120x120"
      href="/static/touch-icon-iphone-retina.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="152x152"
      href="/static/touch-icon-ipad-retina.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/static/touch-icon-iphone-retina-hd.png"
    />

    <style>
      html {
        font-size: 20px;
      }

      body {
        margin: 0;
        color: rgba(0, 0, 0, 0.8);
      }

      .sans-serif {
        font-family: -apple-system, BlinkMacSystemFont, "avenir next", avenir,
          "helvetica neue", helvetica, sans-serif;
      }

      .serif {
        font-family: georgia, times, serif;
      }

      .u-center {
        text-align: center;
      }
      .i {
        font-style: italic;
      }

      .db {
        display: block;
      }
      .dib {
        display: inline-block;
      }
      .dn {
        display: none;
      }

      .inverted {
        color: plum;
        background-color: #490049;
      }

      h1 {
        font-size: 1.5rem;
        font-weight: bolder;
      }

      h2 {
        font-size: 1.5rem;
        font-weight: bold;
      }

      h3 {
        font-size: 1.2rem;
        font-weight: normal;
      }

      .plum {
        background-color: plum;
        color: #490049;
        text-align: center;
        padding-bottom: 1rem;
      }

      code {
        margin: 0;
        white-space: nowrap;
        word-wrap: normal;
        word-break: keep-all;
        letter-spacing: 1px;
        font-family: Consolas, monaco, monospace;
        line-height: 3;
      }

      ::selection {
        background-color: papayawhip;
      }

      ::-moz-selection {
        background-color: papayawhip;
      }

      article {
        padding: 0 1rem;
      }

      p,
      select {
        font-size: 0.9rem;
        line-height: 1.5;
      }

      fieldset {
        margin: 0 auto;
        padding: 0 2rem;
        border: 0;
        background-color: #f8f8f8;
      }

      label {
        padding-right: 8px;
        width: 80px;
      }

      button {
        margin: 0 0.5rem;
        font-size: 0.9rem;
        font-weight: 200;
        background: none;
        border: 1px solid;
        border-radius: 8px;
        padding: 8px 16px;
        cursor: pointer;
        color: #490049;
      }

      button[disabled] {
        cursor: not-allowed;
      }

      button svg {
        height: 22px;
        width: 22px;
        vertical-align: middle;
        margin-left: -4px;
        margin-right: 4px;
      }

      footer {
        margin-top: 2rem;
        padding: 2rem 0 1.8em;
        background-color: #f8f8f8;
        font-size: 0.8rem;
      }

      @media (min-width: 34em) {
        h1 {
          font-size: 2rem;
        }
        .plum {
          font-size: 1.2rem;
        }
        article {
          max-width: 34em;
          margin: 0 auto;
        }

        fieldset {
          text-align: center;
        }

        label {
          width: inherit;
        }

        select {
          margin-right: 1rem;
        }

        fieldset p {
          display: inline-block;
        }
      }

      a,
      a:link {
        color: #490049;
      }

      a:visited {
        color: plum;
      }

      a:active {
        color: papayawhip;
        text-decoration: none;
      }

      .highlight {
        border-radius: 24px 4px;
        background-image: linear-gradient(
          -100deg,
          rgba(255, 239, 213, 0.3),
          rgba(255, 239, 213, 0.7) 95%,
          rgba(255, 239, 213, 0.1)
        );
        white-space: nowrap;
      }
    </style>

    <script>
      (function(i, s, o, g, r, a, m) {
        i["GoogleAnalyticsObject"] = r;
        (i[r] =
          i[r] ||
          function() {
            (i[r].q = i[r].q || []).push(arguments);
          }),
          (i[r].l = 1 * new Date());
        (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
      })(
        window,
        document,
        "script",
        "//www.google-analytics.com/analytics.js",
        "ga"
      );

      ga("create", "UA-68049924-1", "auto");
      ga("send", "pageview");
    </script>
  </head>

  <body>
    <h1 class="u-center">
      Here is a <span class="highlight">great</span> password
    </h1>

    <section class="plum">
      <code id="passphrase" class="db u-center">${passphrase}</code>

      <button type="button" id="copy-pp" data-clipboard-text="${passphrase}">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path
            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
          ></path>
        </svg>
        Copy
      </button>

      <button type="button" id="copy-pp-success" disabled class="inverted dn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
          ></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg>
        Copied!
      </button>

      <button type="button" onClick="window.location.reload()">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
        Another
      </button>
    </section>

    <article class="serif">
      <section>
        <h2>What?</h2>

        <p>
          <a href="https://en.wikipedia.org/wiki/Passphrase">Passphrases</a>!
          Easier for you to remember, harder for hackers to guess.
        </p>

        <p>
          A new, unique passphrase made of simple, easy-to-type words is
          generated every time you visit. They are not stored. You are safe to
          take as many as you please.
        </p>

        <h3 class="u-center i">
          There are over
          <strong class="highlight">${permutations}</strong> permutations to
          give out
        </h3>

        <p>
          You can customize passphrases to use more words and different
          separators.
        </p>
      </section>
    </article>

    <form class="sans-serif" method="get" action="/">
      <fieldset>
        <p>
          <label class="dib" for="w">Words</label>

          <select id="w" name="w">
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
          </select>
        </p>

        <p>
          <label class="dib" for="sep">Separator</label>

          <select id="sep" name="sep">
            <option value="-">hyphen</option>
            <option value="_">underscore</option>
            <option value=".">period</option>
            <option value="+">plus</option>
            <option value=" ">space</option>
          </select>
        </p>

        <p><button type="submit">Generate</button></p>
      </fieldset>
    </form>

    <article class="serif">
      <section>
        <h2>Why?</h2>

        <p>
          Strong passwords are <em>still</em> too hard to create, remember, and
          enter. Many systems <em>still</em> suggest lengthy mixed case letters,
          numbers, and symbols even though those types of passwords are easier
          to crack. This fast, approachable tool takes the work out of creating
          strong passwords. Use the friendly passphrase above and be more
          secure.
        </p>
      </section>

      <div class="u-center">&hellip;</div>

      <section>
        <p>
          Pass Plum is
          <a href="https://github.com/maxbeatty/passplum">open source</a> and
          designed so you can easily use your own collection of words.
        </p>

        <p>
          Send your improvements, questions, and ideas to
          <a href="https://github.com/maxbeatty/passplum/issues">GitHub</a> or
          <a href="https://twitter.com/passplum">Twitter</a>.
        </p>
      </section>
    </article>

    <footer class="db u-center sans-serif">
      Created by <a href="https://maxbeatty.com">Max Beatty</a>
      <br />
      <span role="img" aria-label="flag of United States" style="line-height: 3"
        >🇺🇸</span
      >
    </footer>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js"
    ></script>
    <script>
      var clipboard = new ClipboardJS("#copy-pp");

      clipboard.on("success", function(e) {
        e.trigger.classList.add("dn");
        document.getElementById("copy-pp-success").classList.remove("dn");
      });

      clipboard.on("error", console.error);
    </script>
  </body>
</html>
`;
  } catch (err) {
    await captureError(err);

    throw micro.createError(500, STATUS_CODES[500], err);
  }
});
