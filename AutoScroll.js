let previousContent = new Set(); // To keep track of previously seen entries
let alecFoundRetryCount = 0;      // Count of "Alec Gould" retries
let maxAlecRetries = 5;           // Retry limit for finding Alec Gould
let scrollAttempts = 0;           // Track scroll attempts
let maxScrollAttempts = 10;       // Limit for scroll attempts

let interval = setInterval(() => {
    // Scroll to the bottom of the page
    window.scrollTo(0, document.body.scrollHeight);

    // Wait after scrolling to allow content to load
    setTimeout(() => {
        // Get all instances in the "Deleted by" column
        let deletedByColumn = [...document.querySelectorAll('[data-automationid="DetailsRowCell"]')];
        let alecEntries = deletedByColumn.filter(cell => cell.innerText.includes("Alec Gould"));

        // Create a new set of current content
        let currentContent = new Set(deletedByColumn.map(cell => cell.innerText));

        // Check if new content has been loaded by comparing entries in the set
        let newEntries = [...currentContent].filter(x => !previousContent.has(x));

        if (newEntries.length > 0) {
            console.log('New content detected.');
            previousContent = currentContent; // Update the previous content set
            scrollAttempts = 0; // Reset scroll attempts

            // Check for "Alec Gould"
            if (alecEntries.length > 0) {
                let lastAlec = alecEntries[alecEntries.length - 1];
                console.log('Found Alec Gould entry:', lastAlec.innerText);
                lastAlec.scrollIntoView();
                alecFoundRetryCount = 0; // Reset retry count since we found an entry
            } else {
                alecFoundRetryCount++;
                if (alecFoundRetryCount >= maxAlecRetries) {
                    console.log('Stopped: No "Alec Gould" entries found after multiple retries.');
                    clearInterval(interval);
                    return;
                }
            }
        } else {
            console.log('No new content detected.');
            scrollAttempts++;
            if (scrollAttempts >= maxScrollAttempts) {
                console.log('Stopped: Reached maximum scroll attempts without new content.');
                clearInterval(interval);
                return;
            }
        }
    }, 1500);  // Increased delay to 1.5 seconds for loading time

}, 1000);  // Scroll every 1 second
