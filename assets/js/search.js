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
// very dumb search implementation, title + excerpt word characters only
function addSearchValue (post) {
  post.searchValue = toLowerCaseWordChars(`${post.title}${post.custom_excerpt}`);
};

function getPosts () {
  return fetch("/ghost/api/v3/content/posts/?key=28eb36cd70e695b8e6c58c2173&fields=title,url,custom_excerpt&include=tags&limit=all")
    .then(res => res)
    .then(data=> data.json())
    .then(data => {
      data.posts.forEach(addSearchValue);
      window.posts = data.posts;
    })
    .catch(err => console.error("error getting posts: ", err));
}

function getTags () {
  return fetch("/ghost/api/v3/content/tags/?key=28eb36cd70e695b8e6c58c2173&fields=name,slug&limit=all")
    .then(res => res)
    .then(data=> data.json())
    .then(data => window.tags = data.tags)
    .catch(err => console.error("error getting tags: ", err));
}

function search (val) {
  const searchVal = toLowerCaseWordChars(val);
  const resultSet = window.posts.filter(post => post.searchValue.includes(searchVal));
  console.log("Search results: ", resultSet);
  return resultSet
}

getPosts();
getTags();
console.log('window.posts with searchValue and window.tags created');

const searchTrigger = document.getElementById("search");
const searchOverlay = document.getElementById("search-overlay");
const searchInput = document.getElementById("search-input");
const closeOverlay = document.getElementById("close-overlay");
const siteHeaderTitle = document.querySelector('.site-header-title');

searchTrigger.addEventListener('click', () => {
  searchOverlay.classList.remove("display-none");
  siteHeaderTitle.style.visibility = "hidden";
});

closeOverlay.addEventListener('click', function () {
  searchOverlay.classList.add("display-none");
  siteHeaderTitle.style.visibility = "";
})

const debouncedSearch = debounce(search, 200);

searchInput.addEventListener('keyup', (e) => {
  debouncedSearch(e.target.value);
});


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