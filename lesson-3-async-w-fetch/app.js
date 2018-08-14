(function () {
  const form = document.querySelector('#search-form');
  const searchField = document.querySelector('#search-keyword');
  let searchedForText;
  const responseContainer = document.querySelector('#response-container');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    responseContainer.innerHTML = '';
    searchedForText = searchField.value;

    fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
      headers: {
        Authorization: 'Client-ID 14a2748ef2fbdb3402b3a43c75c1da7d013c03955ae474f62e3018208fcb01db',
      },
    }).then(response => response.json())
    .then(addImage)
    .catch(err => requestError(err, 'image'));

    fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=11a30d51c6af4514902f1219c06fc828`)
      .then(response => response.json())
      .then(addArticles)
      .catch(err => requestError(err, 'articles'));
  });

  function requestError(e, part) {
    console.log(e);
    responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning error-${part}">Oh no! There was an error making a request for the ${part}.</p>`);
  }

  function addImage(data) {
    // the function now has one parameter 'data'
    // this param has already been converted from JSON to JS obj, no need JSON.parse()
    let htmlContent = '';
    if (data && data.results && data.results.length > 1) {
      const firstImage = data.results[0];
      htmlContent = `<figure>
        <img src="${firstImage.urls.small}" alt="${searchedForText}">
        <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
        </figure>`;
    } else {
      htmlContent = '<div class="error-no-image"> No images available</div>';
    }
    responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
  }

  function addArticles(data) {
    let htmlContent = '';
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
