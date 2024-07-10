// Add JavaScript code to make the search line dynamic
const searchLines = [
    "Search for any Article on Physics",
    "Search for any Article on Math",
    "Search for any Article on Statistics",
    "Search for any Article on Biology",
    "Search for any Article on Economics",
    "Search for any Article on Computer science",
    "Search for any Article on Electrical engineering",
];

let currentSearchLineIndex = 0;

function changeSearchLine() {
    document.getElementById("dynamic").textContent = searchLines[currentSearchLineIndex];
    currentSearchLineIndex = (currentSearchLineIndex + 1) % searchLines.length;
}

// Change the search line every 3 seconds (adjust as needed)
setInterval(changeSearchLine, 500);
