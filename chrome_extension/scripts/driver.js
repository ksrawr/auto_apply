// scrape this stuff
// https://docs.google.com/spreadsheets/d/1SoWhe2hAqw_9KpX7KXexH3Hi9Eo2FlWAVvLEPSNrk5M/edit?gid=1490588844#gid=1490588844

// trigger our main function when signaled by background to start 
// 1) Prep and get the data
// 2) Send data to background to start function to open the links one by one
// 3) Check Simplify is loaded and click on "Autofill". 
// 4) Delay for 10 seconds. Click Submit
// 5) Check Content Submit and Error if anything is wrong.
// 6) Repeat

// Prep the data
// - Make API call to Python server to read csv
// - Get all relevant job links (software, engineer)

// have chrome runtime event listener to listen to events sent by our background.js
