function getPosts () {
  return fetch("/ghost/api/v3/content/posts/?key=28eb36cd70e695b8e6c58c2173&fields=title,url,custom_excerpt&include=tags&limit=all")
    .then(res => res)
    .then(data=> data.json())
    .then(data => window.posts = data.posts)
}

function getTags () {
  return fetch("/ghost/api/v3/content/tags/?key=28eb36cd70e695b8e6c58c2173&fields=name,slug&limit=all")
    .then(res => res)
    .then(data=> data.json())
    .then(data => window.tags = data.tags)
}

getPosts();
getTags();
console.log('window.posts and window.tags created');

const search = document.getElementById("search");
const searchOverlay = document.getElementById("search-overlay");
const closeOverlay = document.getElementById("close-overlay");
search.addEventListener('click', () => {
  searchOverlay.classList.remove("display-none");
});

closeOverlay.addEventListener('click', function () {
  searchOverlay.classList.add("display-none");
})

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