// @flow

const Rollbar = require("rollbar");
const { fetch, getPermutations } = require("./vault");

// eslint-disable-next-line no-unused-vars
const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true
});

const MAX_TRIES = 10;

module.exports = async () => {
    // Make LEN, SEPARATOR, SCORE_THRESHOLD query params?
    const LEN = 4;
    const SEPARATOR = '-';
    const SCORE_THRESHOLD = 4;
    const passphrase = await fetch(MAX_TRIES, LEN, SEPARATOR, SCORE_THRESHOLD);
    const permutations = getPermutations(LEN);
    
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Easier, Better Passwords">

    <title>Pass Plum</title>

    <link rel="apple-touch-icon" sizes="76x76" href="/touch-icon-ipad.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/touch-icon-iphone-retina.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/touch-icon-ipad-retina.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/touch-icon-iphone-retina-hd.png">

    <link rel="stylesheet" href="/main.css">

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
        </section>

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
        <span role="img" aria-label="flag of United States">🇺🇸</span>
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
