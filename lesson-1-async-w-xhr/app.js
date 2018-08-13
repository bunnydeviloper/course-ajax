(function () {
  const form = document.querySelector('#search-form');
  const searchField = document.querySelector('#search-keyword');
  let searchedForText;
  const responseContainer = document.querySelector('#response-container');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    responseContainer.innerHTML = '';
    searchedForText = searchField.value;
  });

  function requestError(err) {
    console.log(err);
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

  const unsplashRequest = new XMLHttpRequest();
  unsplashRequest.onload = addImage;
  unsplashRequest.onerror = function (err) {
    requestError(err, 'image');
  };
  searchedForText = 'hippos';

  unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
  unsplashRequest.setRequestHeader('Authorization', 'Client-ID 14a2748ef2fbdb3402b3a43c75c1da7d013c03955ae474f62e3018208fcb01db');
  unsplashRequest.send();
})();
