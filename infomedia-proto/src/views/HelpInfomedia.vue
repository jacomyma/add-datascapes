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
            <pre><code>droner</code></pre>
            👉🏿 articles whose text contains "droner".
          </div>
        </div>

        <div class="card help-card">
          <h2>Multiple terms</h2>
          <div class="card-content">
            By default, all terms are optional, as long as one term matches.
            <pre><code>ai algoritmer</code></pre>
            👉🏿 searches for "ai" <strong>or</strong> "algoritmer".
          </div>
        </div>

        <div class="card help-card">
          <h2>Quotes</h2>
          <div class="card-content">
            Use quotes to search full expressions.
            <pre><code>"dansk ungdoms fællesråd"</code></pre>
            👉🏿 articles containing "dansk ungdoms fællesråd", and not just one
            of the words.
          </div>
        </div>

        <div class="card help-card">
          <h2>Boosting ^</h2>
          <div class="card-content">
            <pre><code>vestager^3 trump</code></pre>
            👉🏿 "vestager" counts triple for relevance (for ordering the
            results).
          </div>
        </div>

        <div class="card help-card">
          <h2>OR, AND, NOT, ( )</h2>
          <div class="card-content">
            You <em>must</em> use parentheses to specify priority.
            <pre><code>(siri OR alexa) AND ai AND NOT eu</code></pre>
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
            <pre><code>siri alexa +ai -eu</code></pre>
            👉🏿 "ai" must be present; "eu" must be absent; "siri" and "alexa"
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
            <pre><code>facebook?</code></pre>
            👉🏿 Finds "Facebook" as well as "Facebooks"
          </div>
        </div>

        <div class="card help-card">
          <h2>Field search</h2>
          <div class="card-content">
            You can search in specific fields.
            <pre><code>heading:(droner AND fugle)</code></pre>
            👉🏿 "droner" and "fugle" in the title.
            <br /><br />
            <pre><code>publishdate:2018-08-10</code></pre>
            👉🏿 articles published the 2018-08-10.
          </div>
        </div>

        <div class="card help-card">
          <h2>Range</h2>
          <div class="card-content">
            <pre><code>publishdate:[2018-01-01 TO 2018-01-31]</code></pre>
            👉🏿 All articles from January 2018
            <br />
            <br />
            <pre><code>year:[2015 TO *]</code></pre>
            👉🏿 All articles from 2015 or later
          </div>
        </div>

        <div class="card help-card">
          <h2>Useful fields</h2>
          <div class="card-content">
            <p>
              <code>publishdate</code><br />Publication date. Ex: "2021-06-09"
            </p>
            <p><code>sourcename</code><br />Newspaper. Ex: "Børsen.dk"</p>
            <p><code>year</code><br />Ex: "2020"</p>
            <p><code>heading</code><br />Title.</p>
            <code>text</code><br />Article text (default field).
          </div>
        </div>

        <div class="card help-card">
          <h2>Main newspapers</h2>
          <div class="card-content">
            Here is the list of the newspapers with at least 50 articles in the
            corpus.
          </div>
          <div style="max-height: 200px; overflow-y: scroll">
            Politiken.dk (1495); Jyllands-Posten (1259); Politiken (1254);
            Ing.dk (Ingeniøren) (1076); Børsen.dk (Abonnementsområde) (784);
            Pro.ing.dk/datatech (710); Ritzaus Bureau (621); Ingeniøren (517);
            Information (420); Børsen.dk (415); Jyllands-posten.dk (381);
            Kristeligt Dagblad (362); Børsen (334); Information.dk (323);
            Jyllands-posten.dk (Abonnementsområde) (295); Information.dk
            (Abonnementsområde) (282); Fyens.dk (266); Ekstrabladet.dk (249);
            Ekstra Bladet (198); Techmanagement.dk (187); Fyens Stiftstidende
            (176); Kristeligt-Dagblad.dk (173); EkstraBladet.dk (156); Sn.dk
            (Sjællands Nyheder) (155); Århus Stiftstidende (154); Frederiksborg
            Amts Avis (148); Jv.dk (Abonnementsområde) (138);
            Pro.ing.dk/Gridtech (138); Stiften.dk (Århus Stiftstidende) (136);
            Jp.dk (Jyllands-Posten) (Abonnementsområde) (129); Hsfo.dk (Horsens
            Folkeblad) (99); Jp.dk (Jyllands-Posten) (96); Helsingør Dagblad
            (88); Fyns Amts Avis (85); Amtsavisen.dk (Randers Amtsavis) (79);
            Epn.dk (Erhverv På Nettet) (77); JP Aarhus (74); Pro.ing.dk/digitech
            (74); JydskeVestkysten (65); Penge.Børsen.dk (65);
            EkstraBladet.dk/Plus (64); Faa.dk (61); VejleAmtsFolkeblad.dk (60);
            Penge og Privatøkonomi (59); DagbladetRingSkjern.dk (Dagbladet
            Ringkøbing-Skjern) (56); Nordvestnyt Holbæk/Odsherred (56); Randers
            Amtsavis (55); Dagbladet-Holstebro-Struer.dk (54); Horsens Folkeblad
            (52); Sjællandske Slagelse (52); Viborg Stifts Folkeblad (52);
            Pro.ing.dk/industrytech (51); Frdb.dk (Fredericia dagblad) (50);
            Helsingordagblad.dk (49); JP.dk (Jyllands-Posten) (48); Sjællandske
            Næstved (48); Erhvervsavisen Fyn (45); Erhverv+ Sydjylland (43);
            Borsenpro.dk/finans (42); Folkebladetlemvig.dk (Lemvig Folkeblad)
            (40); Viborg-folkeblad.dk (Abonnementsområde) (39); Mitfyn.dk (37);
            Dagbladet Roskilde (36); Fredericia Dagblad (34);
            Pro.ing.dk/watertech (34); Avisen Danmark (morgen) (33); Børsen
            Søndag (33); Pro.ing.dk/mobilitytech (30); Vejle Amts Folkeblad
            (30).
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
