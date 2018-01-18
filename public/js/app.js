buildPage(`Dirtybird`);
document.getElementById(`navigation_bar`).addEventListener(`click`, (event) => {
  event.preventDefault();
  switch (event.target.innerHTML) {
    case `DIRTYBIRD`:
      buildPage(`Dirtybird`);
      break;
    case `CS`:
      buildPage(`cscareerquestions`);
      break;
    case `EAT`:
      buildPage(`EatCheapAndHealthy`);
      break;
    case `RANDOM`:
      buildPage(`random`);
      break;
  }
});
document.getElementById(`instagram_grey`).addEventListener(`mouseover`, (event) => {
  event.target.src = `assets/instagram_orange.svg`;
});
document.getElementById(`instagram_grey`).addEventListener(`mouseout`, (event) => {
  event.target.src = `assets/instagram_grey.svg`;
});
document.getElementById(`facebook_grey`).addEventListener(`mouseover`, (event) => {
  event.target.src = `assets/facebook_orange.svg`;
});
document.getElementById(`facebook_grey`).addEventListener(`mouseout`, (event) => {
  event.target.src = `assets/facebook_grey.svg`;
});

function buildPage(sub) {
  let xhr = new XMLHttpRequest();
  xhr.addEventListener(`load`, function (event) {
    let data = fetchData(event);
    let container = createElement(`div`, `page_inner_div`);
    let doublePostContainer = createElement(`div`, `double_post_container`);
    data.forEach((curr, index) => {
      let post = createPost(curr);
      if (index % 2 === 0) {
      } else {
      }
      doublePostContainer.appendChild(post);
      if (index % 2 !== 0) {
        container.appendChild(doublePostContainer);
        doublePostContainer = createElement(`div`, `double_post_container`);
      }
    });
    document.getElementById(`page_container`).innerHTML = ``;
    document.getElementById(`page_container`).innerHTML = container.innerHTML;
  });
  xhr.open(`GET`, `https://www.reddit.com/r/${sub}.json`);
  xhr.send();
}

function fetchData(event) {
  let data = JSON.parse(event.target.responseText);
  let keys = [`author`, `title`, `created_utc`, `selftext`, `thumbnail`, `url`];
  let res = [];

  data.data.children.forEach((curr, index) => {
    res.push({});
    keys.forEach((key) => {
      if (key === `thumbnail`) {
        if (curr.data.hasOwnProperty(`preview`)) {
          res[index][key] = curr.data.preview.images[0].source.url;
        } else {
          res[index][key] = ``;
        }
      } else {
        res[index][key] = curr.data[key];
      }
    });
  });
  return res;
}

function createElement(type, className, innerHTML) {
  let element = document.createElement(type);
  if (className) {
    element.className = className;
  }
  if (innerHTML) {
    element.innerHTML = innerHTML;
  }
  return element;
}

function createPost(data) {
  let container = createElement(`div`, `post_container`);
  let thumbnail = createElement(`div`, `thumbnail`);
  if (!data.thumbnail || data.thumbnail === `self`) {
    thumbnail.style.backgroundImage = `url('../assets/dirtybird.jpg')`;
  } else {
    thumbnail.style.backgroundImage = `url('${data.thumbnail}')`;
  }
  container.appendChild(thumbnail);
  let text_container = createElement(`div`, `text_container`);
  text_container.appendChild(createElement(`h2`, `post_title`, data.title));
  container.appendChild(text_container);
  let timeSincePosted = moment.unix(data['created_utc']).utc().fromNow();
  let post_details = createElement(`ul`, `post_details`);
  post_details.appendChild(createElement(`li`, `post_data`, `by ${data.author}`));
  post_details.appendChild(createElement(`li`, `nobullet post_data`, `${timeSincePosted}`));
  text_container.appendChild(post_details);
  text_container.appendChild(createElement(`p`, `post_text`, data.selftext));
  container.addEventListener(`click`, (event) => {
    window.open(data.url);
  });
  return container; 
}