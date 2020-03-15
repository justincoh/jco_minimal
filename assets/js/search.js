function debounce(fn, ms) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  }
}

function toLowerCaseWordChars (str) {
  return str.toLowerCase().replace(/\W+/g, '');
}
// very dumb search implementation, title + excerpt + tags word characters only
function addSearchValue (post) {
  let searchStr = `${post.title}${post.custom_excerpt}`;
  searchStr += post.tags.reduce((accum, tag) => accum + tag.name, '');
  post.searchValue = toLowerCaseWordChars(searchStr)
};

// 14c11e2f1a17d0c2ba75b2b44e - live
// 28eb36cd70e695b8e6c58c2173 - dev
function getPosts () {
  return fetch("/ghost/api/v3/content/posts/?key=14c11e2f1a17d0c2ba75b2b44e&fields=title,url,custom_excerpt&include=tags&limit=all")
    .then(res => res)
    .then(data=> data.json())
    .then(data => {
      data.posts.forEach(addSearchValue);
      window.posts = data.posts;
    })
    .catch(err => console.error("error getting posts: ", err));
}

// function getTags () {
//   return fetch("/ghost/api/v3/content/tags/?key=28eb36cd70e695b8e6c58c2173&fields=name,slug&limit=all")
//     .then(res => res)
//     .then(data=> data.json())
//     .then(data => window.tags = data.tags)
//     .catch(err => console.error("error getting tags: ", err));
// }

function search (val) {
  searchResults.textContent = ""; // quickly clear the whole bucket
  if (!val) { return; }

  const searchVal = toLowerCaseWordChars(val);
  const resultSet = window.posts.filter(post => post.searchValue.includes(searchVal));

  if (resultSet.length) {
    return resultSet.forEach(createSearchResult); // refill it
  }

  return createNoResultsMessage(val);
}

getPosts();
// getTags();
console.log('window.posts with searchValue');

const searchTrigger = document.getElementById("search");
const searchOverlay = document.getElementById("search-overlay");
const searchInput = document.getElementById("search-input");
const searchResults = document.querySelector(".search-results");
const closeOverlay = document.getElementById("close-overlay");
const siteHeaderTitle = document.querySelector('.site-header-title');

function showSearch () {
  searchOverlay.classList.remove("display-none");
  siteHeaderTitle.style.visibility = "hidden";
  searchInput.focus();
}

function hideSearch () {
  searchOverlay.classList.add("display-none");
  siteHeaderTitle.style.visibility = "";
}

searchTrigger.addEventListener('click', showSearch)

// cuz i love vim
document.body.addEventListener('keyup', (e) => {
  if (e.key === "/") {
    if (searchOverlay.className.includes("display-none")) {
      showSearch();
    }
  }
  if (e.key === "Escape") {
    if (!searchOverlay.className.includes("display-none")) {
      hideSearch();
    }
  }
});

closeOverlay.addEventListener('click', hideSearch);

const debouncedSearch = debounce(search, 200);

searchInput.addEventListener('keyup', (e) => {
  debouncedSearch(e.target.value);
});

function createSearchResult (post) {
  const anchor = document.createElement('a');
  anchor.className = "search-results-item margin-top-sm";
  anchor.href = post.url;
  anchor.innerText = post.title;
  searchResults.appendChild(anchor);
}

function createNoResultsMessage (term) {
  const message = document.createElement('p');
  message.className = "search-results-item";
  message.innerText = `No results found for "${term}"`
  searchResults.appendChild(message);
}

/* example post object

posts: [
{
title: "Why does a week have seven days?",
custom_excerpt: "Also, why do some years have have leap days?",
tags: [
{
id: "5e5ac5ce8673eff102111a76",
name: "Time",
slug: "time",
description: null,
feature_image: null,
visibility: "public",
meta_title: null,
meta_description: null,
url: "http://localhost:2368/tag/time/"
},
{
id: "5da391c0a43e00037d39f0e4",
name: "Space",
slug: "space",
description: null,
feature_image: null,
visibility: "public",
meta_title: null,
meta_description: null,
url: "http://localhost:2368/tag/space/"
},
{
id: "5da391c0a43e00037d39f0e5",
name: "Bad Astronomy",
slug: "bad-astronomy",
description: null,
feature_image: null,
visibility: "public",
meta_title: null,
meta_description: null,
url: "http://localhost:2368/tag/bad-astronomy/"
}
],
url: "http://localhost:2368/why-does-a-week-have-seven-days/"
},
*/