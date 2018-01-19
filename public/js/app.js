let currentSub = `Dirtybird`;
buildPage(`Dirtybird`);
document.getElementById(`navigation_bar`).addEventListener(`click`, (event) => {
  switch (event.target.innerHTML) {
    case `DIRTYBIRD`:
      currentSub = `Dirtybird`;
      buildPage(`Dirtybird`);
      break;
    case `CS`:
      currentSub = `cscareerquestions`;
      buildPage(`cscareerquestions`);
      break;
    case `EAT`:
      currentSub = `EatCheapAndHealthy`;
      buildPage(`EatCheapAndHealthy`);
      break;
    case `RANDOM`:
      currentSub = `random`;
      buildPage(`${listOfSubs[Math.floor(Math.random() * listOfSubs.length)]}`);
      break;
  }
});
window.onscroll = function () {
  Array.prototype.slice.call(document.getElementsByClassName(`post_container`)).forEach((curr) => {
    let bottomOfCurrent = curr.getBoundingClientRect().y + curr.getBoundingClientRect().height;
    if (window.innerHeight > bottomOfCurrent - 300) {
      curr.style.opacity = 1;
    }
  });
};
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
document.getElementById(`instagram_grey`).addEventListener(`click`, (event) => {
  window.open(`http://www.instagram.com/bfowluhhh`);
});
document.getElementById(`facebook_grey`).addEventListener(`click`, (event) => {
  window.open(`http://www.facebook.com/brandon.fowler.33`);
});

function buildPage(sub) {
  let xhr = new XMLHttpRequest();
  xhr.addEventListener(`load`, function (event) {
    let data = fetchData(event);
    let container = createElement(`div`, `page_inner_div`);

    let doublePostContainer = createElement(`div`, `double_post_container`);
    data.forEach((curr, index) => {
      let post = createPost(curr);
      doublePostContainer.appendChild(post);
      if (index % 2 !== 0) {
        container.appendChild(doublePostContainer);
        doublePostContainer = createElement(`div`, `double_post_container`);
      }
    });

    window.scrollTo(0, 0);
    document.getElementById(`page_container`).innerHTML = ``;
    document.getElementById(`page_container`).appendChild(container);

    for (element of document.getElementsByClassName(`post_container`)) {
      let bottomOfCurrent = element.getBoundingClientRect().y + element.getBoundingClientRect().height;
      if (window.innerHeight > bottomOfCurrent - 300) {
        element.style.transition = `none`;
        element.style.opacity = 1;
      } else {
        break;
      }
    }
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
    switch(currentSub) {
      case `Dirtybird`:
        thumbnail.style.backgroundImage = `url('../assets/dirtybird.jpg')`;
        break;
      default:
        thumbnail.style.backgroundImage = `url('../assets/reddit.jpg')`;
    }
  } else {
    thumbnail.style.backgroundImage = `url('${data.thumbnail}')`;
  }
  container.appendChild(thumbnail);

  let textContainer = createElement(`div`, `text_container`);
  textContainer.appendChild(createElement(`h2`, `post_title`, data.title));
  container.appendChild(textContainer);
  let timeSincePosted = moment.unix(data['created_utc']).utc().fromNow();
  let postDetails = createElement(`ul`, `post_details`);
  postDetails.appendChild(createElement(`li`, `post_data`, `by ${data.author}`));
  postDetails.appendChild(createElement(`li`, `nobullet post_data`, `${timeSincePosted}`));
  textContainer.appendChild(postDetails);
  textContainer.appendChild(createElement(`p`, `post_text`, data.selftext));
  container.addEventListener(`click`, (event) => {
    window.open(data.url);
  });
  return container;
}