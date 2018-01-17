function buildPage(sub) {
  let xhr = new XMLHttpRequest();
  xhr.addEventListener(`load`, function (event) {
    let data = fetchData(event);
    for (let i = 0; i < 4; i++) {
      buildPost(data[i]);
    }
  });
  xhr.open(`GET`, `https://www.reddit.com/r/${sub}.json`);
  xhr.send();
}

function fetchData(event) {
  let data = JSON.parse(event.target.responseText);
  console.log(data);
  let keys = [`author`, `title`, `created_utc`, `selftext`, `thumbnail`, `url`];
  let res = [];

  data.data.children.forEach((curr, index) => {
    res.push({});
    keys.forEach((key) => {
      res[index][key] = curr.data[key];
    });
  })
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

function clearElement(id) {
  let element = document.getElementById(id);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function buildPost(data) {
  let container = createElement(`div`, `post_container`);
  let thumbnail = createElement(`div`, `thumbnail`);
  if (!data.thumbnail || data.thumbnail === `self`) {
    thumbnail.style.backgroundImage = `url('../assets/dirtybird.jpg')`;
  } else {
    thumbnail.style.backgroundImage = `url('${data.thumbnail}')`;
  }
  container.appendChild(thumbnail);
  container.appendChild(createElement(`h2`, `post_title`, data.title));
  let timeSincePosted = moment.unix(data['created_utc']).utc().fromNow();
  container.appendChild(
    createElement(`h3`, `post_details`, `by ${data.author} - ${timeSincePosted}`)
  );
  container.appendChild(createElement(`p`, `post_text`, data.selftext));
  container.addEventListener(`click`, (event) => {
    window.open(data.url);
  });
  document.getElementById(`page_container`).appendChild(container);
}

let dirtybird = buildPage(`Dirtybird`);
document.getElementById(`navigation_bar`).addEventListener(`click`, (event) => {
  clearElement(`page_container`);
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