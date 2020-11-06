// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { ipcRenderer } = require("electron");

ipcRenderer.on("store-data", function (event, store) {
  const div = document.querySelector("#electron-clipboard");
  div.innerHTML = "";
  store.map((clip) => {
    const card = document.createElement("div");
    card.setAttribute("class", "itn-card");
    card.appendChild(document.createTextNode(clip));
    if (card.textContent !== "" || clip !== "") {
      card.addEventListener("click", () => document.execCommand("copy"));
    }
    div.appendChild(card);
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }

  const btnPinned = document.querySelector("#pinned");
  btnPinned.addEventListener("click", () => {
    console.log("click");
    ipcRenderer.send("pinned");
  });
});
