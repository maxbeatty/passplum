// @flow

const { parse } = require("url");
const Rollbar = require("rollbar");
const { fetch, getPermutations } = require("./vault");

// eslint-disable-next-line no-unused-vars
const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true
});

const MAX_TRIES = 10;
const MAX_LEN = 7;

module.exports = async (req /*: http$IncomingMessage */) => {
  const { query } = parse(req.url, true);

  let LENGTH /*: number */ = 4;
  let SEPARATOR = "-";

  if (query) {
    if (query.w) {
        LENGTH = Number(query.w);
        if (LENGTH > MAX_LEN) {
            LENGTH = MAX_LEN;
        }
    }

    if (query.sep) {
        SEPARATOR = query.sep[0]; // Single character separator
    }
  }

  const SCORE_THRESHOLD = 4; // Zxcvbn maximum
  const passphrase = await fetch(MAX_TRIES, LENGTH, SEPARATOR, SCORE_THRESHOLD);
  const permutations = getPermutations(LENGTH);

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Easier, Better Passwords">

    <title>Pass Plum</title>

    <link rel="icon" href="/assets/favicon.ico">
    <link rel="apple-touch-icon" sizes="76x76" href="/assets/touch-icon-ipad.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/assets/touch-icon-iphone-retina.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/assets/touch-icon-ipad-retina.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/touch-icon-iphone-retina-hd.png">

    <link rel="stylesheet" href="/assets/main.css">

    <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-68049924-1', 'auto');
        ga('send', 'pageview');
    </script>
  </head>

  <body>
    <h1 class="u-center">Here is a <span class="highlight">great</span> password</h1>

    <code id="passphrase" class="u-center" contenteditable="true">${passphrase}</code>

    <article class="serif">
        <section>
            <h2>What?</h2>

            <p>
                <a href="https://en.wikipedia.org/wiki/Passphrase">Passphrases</a>! Easier for you to remember, harder for hackers to guess.
            </p>

            <p>
            A new, unique passphrase made of simple, easy-to-type words is generated every time you visit.
            They are not stored. You are safe to take as many as you please.
            </p>

            <h3 class="u-center i">There are over <strong class="highlight">${permutations}</strong> permutations to give out</h3>

            <p>
            You can customize passphrases to use more words and different separators.
            </p>
        </section>
    </article>

    <form class="sans-serif" method="get" action="/">
        <fieldset>
            <p>
                <label for="w">Words</label>

                <select id="w" name="w">
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                </select>
            </p>

            <p>
                <label for="sep">Separator</label>
            
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
            Strong passwords are <em>still</em> too hard to create, remember, and enter.
            Many systems <em>still</em> suggest lengthy mixed case letters, numbers, and symbols even though those types of passwords are easier to crack.
            This fast, approachable tool takes the work out of creating strong passwords.
            Use the friendly passphrase above and be more secure.
            </p>

        </section>

        <div class="u-center">&hellip;</div>

        <section>
            <p>
            Pass Plum is <a href="https://github.com/maxbeatty/passplum">open source</a> and designed so you can easily use your own collection of words.
            </p>

            <p>
            Send your improvements, questions, and ideas to <a href="https://github.com/maxbeatty/passplum/issues">GitHub</a> or <a href="https://twitter.com/passplum">Twitter</a>.
            </p>
        </section>
    </article>

    <footer class="u-center sans-serif">
        Created by <a href="https://maxbeatty.com">Max Beatty</a>
        <br />
        <span role="img" aria-label="flag of United States" style="line-height: 3">🇺🇸</span>
    </footer>

    <script>
        var el = document.getElementById('passphrase');

        el.addEventListener('click', function () {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(el);
            selection.removeAllRanges();
            selection.addRange(range);
        });
    </script>
  </body>
</html>
`;
};
