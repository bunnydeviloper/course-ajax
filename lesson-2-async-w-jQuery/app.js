(function () {
  const form = document.querySelector('#search-form');
  const searchField = document.querySelector('#search-keyword');
  let searchedForText;
  const responseContainer = document.querySelector('#response-container');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    responseContainer.innerHTML = '';
    searchedForText = searchField.value;

    const unsplashRequest = new XMLHttpRequest();
    unsplashRequest.onload = addImage;
    unsplashRequest.onerror = function (err) {
      requestError(err, 'image');
    };
    unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
    unsplashRequest.setRequestHeader('Authorization', 'Client-ID 14a2748ef2fbdb3402b3a43c75c1da7d013c03955ae474f62e3018208fcb01db');
    unsplashRequest.send();

    const articleRequest = new XMLHttpRequest();
    articleRequest.onload = addArticles;
    articleRequest.onerror = function (err) {
      requestError(err, 'articles');
    };
    articleRequest.open('GET', `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=11a30d51c6af4514902f1219c06fc828`);
    articleRequest.send();
  });

  function requestError(e, part) {
    console.log(e);
    responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning error-${part}">Oh no! There was an error making a request for the ${part}.</p>`);
  }

  function addImage() {
    let htmlContent = '';
    const data = JSON.parse(this.responseText);
    if (data && data.results && data.results[0]) {
      const firstImage = data.results[0];
      htmlContent = `<figure>
        <img src="${firstImage.urls.regular}" alt="${searchedForText}">
        <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
        </figure>`;
    } else {
      htmlContent = '<div class="error-no-image">No images available</div>';
    }
    responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
  }

  function addArticles() {
    let htmlContent = '';
    const data = JSON.parse(this.responseText);
    if (data.response && data.response.docs && data.response.docs.length > 1) {
      htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
      <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
      <p>${article.snippet}</p>
      </li>`
      ).join('') + '</ul>';
    } else {
      htmlContent = '<div class="error-no-articles">No articles available</div>';
    }
    responseContainer.insertAdjacentHTML('beforeend', htmlContent);
  }
})();
