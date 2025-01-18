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
        }, 3000);
    })
}

const observeee = {
    Off() {
        observer.disconnect();
    },
    On() {
        observer.observe(targetNode, config);
    }
};

const delay = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));

const checkForChanges = async() => {
    try {
        return new Promise((resolve) => {
            let timeout;

            const targetNode = document.body;
            const config = { attributes: true, childList: true, subtree: true };

            const observer = new MutationObserver((mutationsList, observer) => {
                if(timeout) clearTimeout(timeout);

                timeout = setTimeout(() => {
                    observer.disconnect();
                    resolve({ status: "SUCCESS", message: "No further changes detected"});
                }, 5000);

                for(const mutation of mutationsList) {
                    console.log(mutation);
                }
            });

            observer.observe(targetNode, config);
            
        });
    } catch (e) {
        return { status: "ERROR", message: "Something went wrong while checking for changes", e };
    }
}

const main = async() => {
    try {
        const simplifyNodes = await getNode('.simplify-jobs-shadow-root', 'query-all') || [];
        const shadowNode = simplifyNodes.length > 0 ? simplifyNodes[simplifyNodes.length - 1].shadowRoot : undefinded;

        if(!shadowNode) return { status: "Failed", message: "Shadow node undefined"}

        const autoFillBtn = shadowNode.getElementById('fill-button');

        if(!autoFillBtn) return { status: "Failed", message: "Fill Button undefined"}

        autoFillBtn.click();

        await delay(10000);

        observeee.On();

        await delay(2000);

        return { status: "AUTOFILLED", message: "Fields autofilled"};

    } catch(e) {
        return { status: "ERROR", message: "Something went wrong while applying", e };
    }
};

const submit = async() => {
    try {
        // Submit the application
        const submitBtn = await getNode('submit_app', 'id');
        await delay(1000);
        submitBtn.click();
        
        const checkSubmission = await checkForChanges();

        return { status: "SUCESS", message: "Clicked submit" };

    } catch(e) {
        return { status: "ERROR", message: "Something went wrong while submitting", e };
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    (async() => {
        console.log(request);
        const { status } = request || {};

        if(status ===  "START_AUTOFILL") {
            const { s, message } = await main() || {};

            if(s === "SUCCESS") {
                sendResponse({ status: "APPLIED", message });
            } else {
                sendResponse({ status: "FAILED", message });
            }
        } else if(status === "SUBMIT") {
            const { s } = await submit() || {};

            s === "SUCCESS" && sendResponse({ status: "SUBMITTED" });
            s === "ERROR" && sendResponse({status: "SUBMISSION_FAILED"});
        }
    })();

    return true;
});

console.log("i am job.js");