<style>
main {
  background-color: #9b9b9b;
}
.headline {
  padding: 12px;
}
.headline h1 {
  margin: 0;
}
.card.help-card {
  width: 400px;
  cursor: default;
}
.card.help-card .card-content p {
  margin-bottom: 12px;
}
.card pre code {
  margin: 6px 0px;
  display: block;
  padding: 6px 6px 6px;
  font-size: 1em;
  line-height: 20px;
  width: 100%;
  background-color: #333;
  font-family: monospace;
  color: #f7f7f7;
}
</style>

<template>
  <main style="display: flex; flex-grow: 1; overflow: hidden">
    <div style="flex-grow: 1; display: flex; flex-direction: column">
      <div class="headline"><h1>ADD | QUERY HELP</h1></div>
      <div
        style="
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-content: flex-start;
          flex-grow: 1;
          overflow-x: scroll;
        "
      >
        <div class="card help-card">
          <h2>It's like Google</h2>
          <div class="card-content">
            <pre><code>modelling</code></pre>
            👉🏿 articles whose text contains "modelling".
          </div>
        </div>

        <div class="card help-card">
          <h2>Multiple terms</h2>
          <div class="card-content">
            By default, all terms are optional, as long as one term matches.
            <pre><code>ai algorithms</code></pre>
            👉🏿 searches for "ai" <strong>or</strong> "algorithms".
          </div>
        </div>

        <div class="card help-card">
          <h2>Quotes</h2>
          <div class="card-content">
            Use quotes to search full expressions.
            <pre><code>"parallel genetic algorithm"</code></pre>
            👉🏿 articles containing "parallel genetic algorithm", and not just one
            of the words.
          </div>
        </div>

        <div class="card help-card">
          <h2>Boosting ^</h2>
          <div class="card-content">
            <pre><code>ai^3 algorithm</code></pre>
            👉🏿 "ai" counts triple for relevance (for ordering the
            results).
          </div>
        </div>

        <div class="card help-card">
          <h2>OR, AND, NOT, ( )</h2>
          <div class="card-content">
            You <em>must</em> use parentheses to specify priority.
            <pre><code>(modeling OR modelling) AND NOT ai</code></pre>
          </div>
        </div>

        <div class="card help-card">
          <h2>Must be present / absent</h2>
          <div class="card-content">
            You can also specify that a term must be present (+) or absent (-).
            <pre><code>-artificial +intelligence</code></pre>
            👉🏿 articles with "intelligence" but not "artificial"
            <br />
            <br />
            <pre><code>modeling modelling +ai -robot</code></pre>
            👉🏿 "ai" must be present; "robot" must be absent; "modeling" and "modelling"
            <em>may</em> be present: it increases the relevance of the article.
          </div>
        </div>

        <div class="card help-card">
          <h2>Wildcards</h2>
          <div class="card-content">
            Search for one (?) or any number (*) of characters.
            <pre><code>algorit*</code></pre>
            👉🏿 Any word starting with "algorit"
            <br />
            <br />
            <pre><code>model?ing</code></pre>
            👉🏿 Finds "modeling" as well as "modelling"
          </div>
        </div>

        <div class="card help-card">
          <h2>Field search</h2>
          <div class="card-content">
            You can search in specific fields.
            <pre><code>coredata.dc\:description:(ai AND bot)</code></pre>
            👉🏿 "ai" and "bot" in the description (the field is "coredata.dc\:description").
            <br /><br />
            <pre><code>coredata.prism\:coverDate:2018-08-10</code></pre>
            👉🏿 articles published the 2018-08-10 (the date field is "coredata.prism\:coverDate").
          </div>
        </div>

        <div class="card help-card">
          <h2>Range</h2>
          <div class="card-content">
            <pre><code>coredata.prism\:coverDate:
[2018-01-01 TO 2018-01-31]</code></pre>
            👉🏿 All articles from January 2018 (the date field is "coredata.prism\:coverDate").
          </div>
        </div>

        <div class="card help-card">
          <h2>Useful fields</h2>
          <div class="card-content">
            <p>
              <code>coredeata.prism\:coverDate</code><br />Publication date. Ex: "2021-06-09"
            </p>
            <p><code>coredata.prism\:publicationName</code><br />Journal name. Ex: "Engineering Structures"</p>
            <p><code>coredata.citedby-count</code><br />Number of citations.</p>
            <p><code>coredata.dc\:title</code><br />Title.</p>
            <code>coredata.openaccessFlag</code><br />Open access or not: "true" or "false".
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
