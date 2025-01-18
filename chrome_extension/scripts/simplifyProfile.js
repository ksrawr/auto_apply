const getNode = (name, option) => {
    let getNodeTimeOut;
    return new Promise((resolve, reject) => {
        if(getNodeTimeOut) clearTimeout(getNodeTimeOut);
        const obj = {
            "class": () => document.getElementsByClassName(`${name}`),
            "tag": () => document.getElementsByTagName(`${name}`),
            "query-one": () => document.querySelector(`${name}`),
            "query-all": () =>  document.querySelectorAll(`${name}`),
            "id": () => document.getElementById(`${name}`),
        }
        getNodeTimeOut = setTimeout(() => {
            const node = obj[option]();
            resolve(node);
        }, 5000);
    })
}

const delay = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));

const main = async() => {
    try {
        const applyBtn = await getNode('.bg-primary-300', "query-one");

        await delay(1000);
            
        applyBtn.click();

        await delay(2000);

        return {s: "SUCCESS", message: "Apply button clicked"};
    } catch (e) {
        return {s: "ERROR", message: "Something went wrong", e};
    }
};

const next = async() => {
    try {
        // document.querySelector('.hidden.size-14.items-center.justify-center.rounded-full.bg-white.shadow')

        const nextBtn = await getNode('.hidden.size-14.items-center.justify-center.rounded-full.bg-white.shadow', "query-one");

        await delay(1000);

        nextBtn.click();

        await delay(3000);

        const {s, message} = await main();

        if(s === "SUCCESS") {
            return {s: "SUCCESS", message: "Next completed!"}
        }

        return {s: "ERROR", message }
    } catch(e) {
        return {s: "ERROR", message: "Something went wrong when going next", e}
    }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    (async() => {
        console.log(request);
        const { status } = request || {};

        if(status ===  "START_SIMPLIFY") {
            const { s } = await main() || {};

            if(s === "SUCCESS") {
                sendResponse({ status: "LINK_CLICKED" });
            }
        } else if(status === "NEXT") {
            const { s } = await next() || {};

            if(s === "SUCCESS") {
                sendResponse({ status: "LINK_CLICKED" });
            }
        }
    })();

    return true;
});

console.log("i am simplify profile");

