const $ = document.querySelector.bind(document);

/**
 * @returns {string} the value of id query parameter
 * @example
 * returns 123 => "example.com?id=123"
 */
function getQueryId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

/**
 * returns the breed according to the uri
 * @param {string} uri the image uri from dog api
 */
function getDogBreed(uri) {
  return uri.match(/breeds\/(.*)\//)[1];
}

/**
 * returns a random img url from the dog api
 * @returns {Promise<string>}
 */
async function getRandomImage() {
  let breed = location.href.split("breed=")[1].replace('-', '/')
  let add = "https://dog.ceo/api/breed/"+breed+"/images/random"
  const r = await fetch(add);
  const { message: link } = await r.json();
  return link;
}

/**
 * hides HTML element by its query selector
 *
 * @param {string} qs element selector
 */
function hideElement(qs) {
  $(qs).style.display = "none";
}

/**
 * set HTML element as visible according to its query selector
 *
 * @param {string} qs element selector
 */
function showElement(qs) {
  $(qs).style.display = "flex";
}

let link = "";
async function onStart(forceNew = false) {
  hideElement("#main-content");
  showElement("#loading");
  const imgId = forceNew ? false : getQueryId();
  link = await getRandomImage();
  
  $("#pic").src = link;
  $("#breed").innerText = getDogBreed(link);
  const anchorTag = $("#perma-link");
}

(() => {
  const img = $("#pic");

  img.addEventListener("load", () => {
    showElement("#main-content");
    hideElement("#loading");
  });
  img.addEventListener("error", () => {
    $("#loading").innerHTML = `
        <h1 class="error">Error</h1>
        <h2>Failed loading the requested image!</h2>
        <small>${getQueryId()}</small>
        `;
  });

  onStart().catch(console.error);

  function share(url, target) {
    const options = "toolbar=0,status=0,resizable=1,width=626,height=436";
    window.open(url, target, options);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "r") {
      onStart(true).catch(console.error);
    }
  });
})();
