const apiKey = "e2aea77fcf6648148681887ec56e530a";
const main = document.querySelector("main");
const sourceSelector = document.querySelector("#sourcesSelector");

const defaultSource = 'bbc-news'

window.addEventListener("load", e => {
  updateNews();
  updateSources();

  sourceSelector.value = defaultSource;

  sourceSelector.addEventListener('change', e => {
    updateNews(e.target.value)
  });

  if("serviceWorker" in navigator){
    try {
      navigator.serviceWorker.register('sw.js');
      console.log("SW Registered");
    } catch (error) {
      console.log("SW failed to register");
    }
  }
  
});

async function updateNews(source = defaultSource) {
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apiKey}`
  );
  const json = await res.json();
  main.innerHTML = json.articles.map(createArticle).join("\n");
}

function createArticle(article) {
  return `
    <article>
      <a href="${article.url}">
        <h2>${article.title}</h2>
        <img src="${article.urlToImage}" />
        <p>${article.description}</p>
      </a>
    </article>
  `;
}

async function updateSources() {
  const res = await fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`);
  const json = await res.json();

  sourceSelector.innerHTML = json.sources
    .map(src => `<option value="${src.id}"> ${src.name}</option>`)
    .join("\n");
}
