document.getElementById('start').addEventListener('click', () => {
    chrome.runtime.sendMessage({ status: "START" });
})

document.getElementById('stop').addEventListener('click', () => {
    chrome.runtime.sendMessage({ status: "STOP" });
})