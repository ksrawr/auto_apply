chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    (async() => {
        if(request.status === "START") {
        
        } else if(request.status === "TERMINATE") {
            sendResponse({status: "TERMINATE", message: "Closing Extension"});
        } else if(request.status === "SIMPLIFY") {

            const [simplifyTab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
            let curr = await chrome.tabs.sendMessage(simplifyTab.id, {status: "GET_CURRENT"});
            let processing = false;
            console.log(curr);
            // let next = await chrome.tabs.sendMessage(simplifyTab.id, {status: "NEXT"});
            while(curr.current) {
                if(!processing) {
                    processing = true;

                    const prepTab = (tab) => {
                        return new Promise((resolve) => {
                            const isTabReady = (tabId, changeInfo) => {
                                console.log(changeInfo);
                                if(tab.id === tabId && changeInfo.status === "complete") {
                                    chrome.tabs.onUpdated.removeListener(isTabReady);
                                    resolve();
                                }
                            }
                            chrome.tabs.onUpdated.addListener(isTabReady);
                        })

                    }

                    const injectJS = (tab) => {
                        return chrome.scripting.executeScript({target: {tabId: tab.id}, files : ["scripts/job.js"]}).then(() => {
                            console.log("JS injected!");
                        })
                    };

                    const delay = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));

                    await new Promise(async(resolve) => {
                        console.log("adding listener for newly created tab")
                        await chrome.tabs.onCreated.addListener(async(tab) => {
                            await prepTab(tab);

                            // await chrome.scripting.executeScript({target: {tabId: tab.id}, files : ["scripts/job.js"]}, () => {
                            //     console.log("JS injected!");
                            // });

                            await injectJS(tab);
                            console.log("trying to apply...");

                            await chrome.tabs.sendMessage(tab.id, {status: "START_AUTOFILL"});
                            // const applyRes = await chrome.tabs.sendMessage(tab.id, {status: "START_AUTOFILL"});
                            // console.log(applyRes);
                            // const submitRes = applyRes.status === "APPLIED" && await chrome.tabs.sendMessage(tab.id, {status: "SUBMIT"});
                            
                            await chrome.tabs.sendMessage(tab.id, {status: "SUBMIT"});
                            
                            const goNext = await chrome.tabs.sendMessage(simplifyTab.id, {status: "NEXT"});
                            console.log(goNext);
                            const nextCurr = await chrome.tabs.sendMessage(simplifyTab.id, {status: "GET_CURRENT"});
                            console.log(nextCurr);
                            curr = nextCurr.current;
                            processing = false;

                            // await delay(2000);
                        });
                        resolve();
                    });

                    const response = await chrome.tabs.sendMessage(simplifyTab.id, {status: "START_SIMPLIFY", message: "Starting Extension"});
                    console.log(response);


                    // const submitApp = new Promise(async(resolve) => {
                    //     await chrome.tabs.onCreated.addListener(async(tab) => {
                    //         await chrome.tabs.onUpdated.addListener(async(tabId, changeInfo, tabUpdated) => {
                    //             if(tab.id === tabId && changeInfo.status === "complete") {
                    //                 await chrome.scripting.executeScript({target: {tabId: tab.id}, files : ["scripts/job.js"]}, () => {
                    //                     console.log("JS injected!");
                    //                 });
                                    
                    //                 await delay(3000);
    
                    //                 const applyRes = await chrome.tabs.sendMessage(tab.id, {status: "START_AUTOFILL"});
                    //                 console.log(applyRes);
                    //                 const submitRes = applyRes.status === "APPLIED" && await chrome.tabs.sendMessage(tab.id, {status: "SUBMIT"});
                    //                 console.log(submitRes);
                
                    //                 const goNext = await chrome.tabs.sendMessage(simplifyTab.id, {status: "NEXT"});
                    //                 console.log(goNext);
                    //                 const nextCurr = await chrome.tabs.sendMessage(simplifyTab.id, {status: "GET_CURRENT"});
                    //                 console.log(nextCurr);
                    //                 curr = nextCurr.current;
                    //                 processing = false;

                    //                 await delay(2000);

                    //                 resolve();
                    //             }
                    //         })
                    //     });
                    //     const response = await chrome.tabs.sendMessage(simplifyTab.id, {status: "START_SIMPLIFY", message: "Starting Extension"});
                    //     console.log(response);
                    // });

                    // await chrome.tabs.onCreated.addListener(async(tab) => {
                    //     await chrome.tabs.onUpdated.addListener(async(tabId, changeInfo, tabUpdated) => {
                    //         if(tab.id === tabId && changeInfo.status === "complete") {
                    //             await chrome.scripting.executeScript({target: {tabId: tab.id}, files : ["scripts/job.js"]}, () => {
                    //                 console.log("JS injected!");
                    //             });
                                
                    //             await delay(3000);

                    //             const applyRes = await chrome.tabs.sendMessage(tab.id, {status: "START_AUTOFILL"});
                    //             console.log(applyRes);
                    //             const submitRes = applyRes.status === "APPLIED" && await chrome.tabs.sendMessage(tab.id, {status: "SUBMIT"});
                    //             console.log(submitRes);
    
                    //             chrome.tabs.update(simplifyTab.id, { active: true});
    
                    //             const goNext = await chrome.tabs.sendMessage(simplifyTab.id, {status: "NEXT"});
                    //             console.log(goNext);
                    //             const nextCurr = await chrome.tabs.sendMessage(simplifyTab.id, {status: "GET_CURRENT"});
                    //             console.log(nextCurr);
                    //             curr = nextCurr.current;
                    //             processing = false;
                    //         }
                    //     })
                    // });
    
                    // const response = await chrome.tabs.sendMessage(simplifyTab.id, {status: "START_SIMPLIFY", message: "Starting Extension"});
                    // console.log(response);
                }
                // await chrome.tabs.onCreated.addListener(async(tab) => {
                //     await chrome.tabs.onUpdated.addListener(async(tabId, changeInfo, tabUpdated) => {
                //         if(tab.id === tabId && changeInfo.status === "complete") {
                //             await chrome.scripting.executeScript({target: {tabId: tab.id}, files : ["scripts/job.js"]}, () => {
                //                 console.log("JS injected!");
                //             });

                //             const applyRes = await chrome.tabs.sendMessage(tab.id, {status: "START_AUTOFILL"});
                //             console.log(applyRes);
                //             const submitRes = applyRes.status === "APPLIED" && await chrome.tabs.sendMessage(tab.id, {status: "SUBMIT"});
                //             console.log(submitRes);

                //             chrome.tabs.update(simplifyTab.id, { active: true});

                //             const goNext = await chrome.tabs.sendMessage(simplifyTab.id, {status: "NEXT"});
                //             console.log(goNext);
                //             const nextCurr = await chrome.tabs.sendMessage(simplifyTab.id, {status: "GET_CURRENT"});
                //             console.log(nextCurr);
                //             curr = nextCurr.current;
                //         }
                //     })
                // });

                // const response = await chrome.tabs.sendMessage(simplifyTab.id, {status: "START_SIMPLIFY", message: "Starting Extension"});
                // console.log(response);
                
                // const [jobAppTab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
                // await chrome.scripting.executeScript({target: {tabId: jobAppTab.id}, files : ["scripts/job.js"]}, () => {
                //     console.log("JS injected!");
                // });

                // await delay(3000);
                // console.log("after delay");

                // const applyRes = await chrome.tabs.sendMessage(jobAppTab.id, {status: "START_AUTOFILL"});
                // console.log(applyRes);
                // const submitRes = applyRes.status === "APPLIED" && await chrome.tabs.sendMessage(jobAppTab.id, {status: "SUBMIT"});
                // console.log(submitRes);
                


                // const goNext = await chrome.tabs.sendMessage(simplifyTab.id, {status: "NEXT"});
                // console.log(goNext);
                // const nextCurr = await chrome.tabs.sendMessage(simplifyTab.id, {status: "GET_CURRENT"});
                // console.log(nextCurr);
                // curr = nextCurr.current;



                // next = await chrome.tabs.sendMessage(simplifyTab, {status: "NEXT"});
            }
            // TODO: Talk back to simplify tab and go next if it exists, current node is a job if not exit

        } else if(request.status === "LINK_CLICKED") {
            console.log("hello???");

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

                // await chrome.scripting.executeScript({target: {tabId: tab.id}, files : ["simplifyProfiles.js"]}, () => {
                //     console.log("Yes");
                // });
            }
        }
    })();
    return true;
});

chrome.tabs.onCreated.addListener(async(tab) => {
    chrome.tabs.onUpdated.addListener(async(tabId, changeInfo, tabUpdated) => {
        if(tab.id === tabId && changeInfo.status === "complete") {
            await chrome.scripting.executeScript({target: {tabId: tab.id}, files : ["scripts/job.js"]}, () => {
                console.log("JS injected!");
            });
        }
    })
});