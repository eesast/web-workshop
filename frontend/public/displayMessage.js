const displayMessage = (message) => {
  const messageDOM = document.createElement("div");
  messageDOM.innerHTML = `
    <div class="card" style="background-color: rgba(255, 255, 255, 0.75);">
      ${message}
    </div>
  `;
  messageDOM.style = `
    position: fixed;
    top: 12px;
    left: 0px;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
  `;
  const bodyDOM = document.getElementsByTagName("body")[0];
  bodyDOM.appendChild(messageDOM);
  setTimeout(() => {
    bodyDOM.removeChild(messageDOM);
  }, 2000);
};

const successIcon =`
  <svg t="1722432544595" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1455" width="1.2em" height="1.2em" style="position: relative; top: 0.2em;">
    <path d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m-74.965333 550.4L346.453333 545.152a42.666667 42.666667 0 1 0-60.330666 60.330667l120.704 120.704a42.666667 42.666667 0 0 0 60.330666 0l301.653334-301.696a42.666667 42.666667 0 1 0-60.288-60.330667l-271.530667 271.488z" fill="#52C41A" p-id="1456"></path>
  </svg>
`;
export const displaySuccessMessage = (message) => {
  displayMessage(`${successIcon}<span style="color: green;">${message}</span>`);
};
const warningIcon = `
  <svg t="1722433782874" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7634" width="1em" height="1em" style="position: relative; top: 0.1em;">
    <path d="M512 1024C229.248 1024 0 794.752 0 512S229.248 0 512 0s512 229.248 512 512-229.248 512-512 512z m0-85.333333c235.648 0 426.666667-191.018667 426.666667-426.666667S747.648 85.333333 512 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667z m-42.666667-469.333334a42.666667 42.666667 0 0 1 85.333334 0v298.666667a42.666667 42.666667 0 0 1-85.333334 0v-298.666667z m38.4-136.533333a59.733333 59.733333 0 1 1 0-119.466667 59.733333 59.733333 0 0 1 0 119.466667z" fill="#FA1155" p-id="7635"></path>
  </svg>
`;
export const displayWarningMessage = (message) => {
  displayMessage(`${warningIcon}<span style="color: darkred;">${message}</span>`);
};

export default displayMessage;
