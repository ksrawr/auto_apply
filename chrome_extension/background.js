chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    (async() => {
        if(request.status === "START") {
        
        } else if(request.status === "TERMINATE") {
            sendResponse({status: "TERMINATE", message: "Closing Extension"});
        } else if(request.status === "SIMPLIFY") {
            const [simplifyTab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
            const response = await chrome.tabs.sendMessage(simplifyTab.id, {status: "START_SIMPLIFY", message: "Starting Extension"});
            console.log(response);

            const [jobAppTab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
            await chrome.scripting.executeScript({target: {tabId: jobAppTab.id}, files : ["scripts/job.js"]}, () => {
                console.log("JS injected!");
            });

            const applyRes = await chrome.tabs.sendMessage(jobAppTab.id, {status: "START_AUTOFILL"});
            console.log(applyRes);
            const submitRes = applyRes.status === "APPLIED" && await chrome.tabs.sendMessage(jobAppTab.id, {status: "SUBMIT"});

        } else if(request.status === "LINK_CLICKED") {
            console.log("hello???");
            // SEND MESSAGE TO APPLY TO OPENED TAB
            // WAIT FOR 

            // const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
            // const tabReady = await new Promise(async(resolve) => {
            //     await chrome.tabs.onUpdated.addListener((tabId, changeInfo, tabUpdated) => {
            //         console.log(changeInfo);
            //         console.log(tabId);
            //         console.log(tab);
            //         if(tab.id === tabId && changeInfo.status === "complete") {
            //             resolve(true);
            //         }
            //     })
            // });
            // await chrome.scripting.executeScript({target: {tabId: tab.id}, files : ["scripts/simplifyProfile.js"]}, () => {
            //     console.log("Yes");
            // });

            tabReady = undefined;

            if(tabReady) {
                // const response = await chrome.tabs.sendMessage(tab.id, {status: "AUTOFILL", message: "Simplify Autofill"});
                // console.log(response);

                await chrome.scripting.executeScript({target: {tabId: tab.id}, files : ["simplifyProfiles.js"]}, () => {
                    console.log("Yes");
                });
            }
        }
    })();
    return true;
});