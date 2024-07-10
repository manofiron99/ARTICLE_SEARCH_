// Change theme javaScript
document.addEventListener("DOMContentLoaded", function () {
    // Check the user's preference from localStorage
    const userPrefersDark = localStorage.getItem("theme") === "dark";

    // Apply the initial theme based on user preference
    toggleTheme(userPrefersDark);

    // Add an event listener to the theme toggle button
    document.getElementById("themeToggle").addEventListener("click", function () {
        // Toggle the theme and save the user's preference to localStorage
        const isDarkMode = document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    });
});

// Function to toggle the theme based on user preference
function toggleTheme(isDarkMode) {
    document.body.classList.toggle("dark-mode", isDarkMode);
}
// You can also add code to detect user's system preferences and automatically apply the theme


// Add an event listener to the search button
document.getElementById("searchButton").addEventListener("click", () => {
    const searchInput = document.getElementById("searchInput");
    const loadingSpinner = document.getElementById("loadingSpinner");

    const input = searchInput.value;

    if (input) {
        loadingSpinner.classList.remove("d-none");

        // Construct the API URL for arXiv based on the user's input
        const apiUrl = `https://export.arxiv.org/api/query?search_query=all:${input}`;

        fetch(apiUrl)
            .then(response => response.text())
            .then(data => {
                loadingSpinner.classList.add("d-none");

                // Parse the XML response (you may want to use a library for this)
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, "text/xml");
                const entries = xmlDoc.querySelectorAll("entry");

                const articles = Array.from(entries).map(entry => {
                    const publishedDateElement = entry.querySelector("published");
                    if (publishedDateElement) {
                        const publishedDate = new Date(publishedDateElement.textContent).toLocaleDateString();

                        // Collect all author names
                        const authors = Array.from(entry.querySelectorAll("author")).map(author => author.textContent);

                        // Get the DOI or display 'DOI not available'
                        const doiElement = entry.querySelector("doi");
                        const doi = doiElement ? doiElement.textContent : 'DOI not available';

                        // Get the published venue or display 'Venue not available'
                        const venueElement = entry.querySelector("journal_ref");
                        const venue = venueElement ? venueElement.textContent : 'Venue not available';

                        return {
                            title: entry.querySelector("title").textContent,
                            summary: entry.querySelector("summary").textContent,
                            authors: authors,
                            pdfLink: entry.querySelector("link[title='pdf']").getAttribute("href"),
                            publishedDate: publishedDate,
                            doi: doi,
                            venue: venue, // Add the venue to the article object
                        };
                    } else {
                        console.warn('Published Date not found in entry:', entry);
                        return null; // Skip this entry if the published date is not found
                    }
                }).filter(article => article !== null);

                displayArticles(articles);
            })
            .catch(error => {
                loadingSpinner.classList.add("d-none");
                console.error("Error:", error);
            });
    }
});

// Function to fetch and display the latest articles
function fetchLatestArticles() {
    const loadingSpinner = document.getElementById("loadingSpinner");
    loadingSpinner.classList.remove("d-none");

    // Construct the API URL for arXiv to get the latest articles
    const apiUrl = `https://export.arxiv.org/api/query?search_query=all&sortBy=submittedDate&sortOrder=descending`;

    fetch(apiUrl)
        .then(response => response.text())
        .then(data => {
            loadingSpinner.classList.add("d-none");

            // Parse the XML response (you may want to use a library for this)
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
            const entries = xmlDoc.querySelectorAll("entry");

            const articles = Array.from(entries).map(entry => {
                const publishedDateElement = entry.querySelector("published");
                if (publishedDateElement) {
                    const publishedDate = new Date(publishedDateElement.textContent).toLocaleDateString();

                    // Collect all author names
                    const authors = Array.from(entry.querySelectorAll("author")).map(author => author.textContent);

                    // Get the DOI or display 'DOI not available'
                    const doiElement = entry.querySelector("doi");
                    const doi = doiElement ? doiElement.textContent : 'DOI not available';

                    // Get the published venue or display 'Venue not available'
                    const venueElement = entry.querySelector("journal_ref");
                    const venue = venueElement ? venueElement.textContent : 'Venue not available';

                    return {
                        title: entry.querySelector("title").textContent,
                        summary: entry.querySelector("summary").textContent,
                        authors: authors,
                        pdfLink: entry.querySelector("link[title='pdf']").getAttribute("href"),
                        publishedDate: publishedDate,
                        doi: doi,
                        venue: venue, // Add the venue to the article object
                    };
                } else {
                    console.warn('Published Date not found in entry:', entry);
                    return null; // Skip this entry if the published date is not found
                }
            }).filter(article => article !== null);

            displayArticles(articles);
        })
        .catch(error => {
            loadingSpinner.classList.add("d-none");
            console.error("Error:", error);
        });
}

// Function to display articles
function displayArticles(articles) {
    const articleList = document.getElementById("articleList");

    // Clear previous results
    articleList.innerHTML = "";

    // Loop through articles and create HTML elements to display them
    articles.forEach(article => {
        const articleDiv = document.createElement("div");
        articleDiv.className = "col-md-12";
        articleDiv.innerHTML = `
            <h4 style="color: blue">TITLE: ${article.title}</h4>
            <p>SUMMARY: ${article.summary}</p>

            <!-- <p>AUTHORS: ${article.authors.join(', ')}</p> -->
            <!-- <p>DOI: ${article.doi}</p>  Display the DOI -->
            <!-- <p>Venue: ${article.venue}</p>  Display the Venue -->
            
            <a href="${article.pdfLink}" class="btn btn-danger" target="_blank" download>Download PDF</a>
            <a href="metadata.html?title=${encodeURIComponent(article.title)}&summary=${encodeURIComponent(article.summary)}&authors=${encodeURIComponent(article.authors.join(', '))}&publishedDate=${encodeURIComponent(article.publishedDate)}&doi=${encodeURIComponent(article.doi)}&venue=${encodeURIComponent(article.venue)}" class="btn btn-primary">Show Metadata</a>
            <br><br><br><br>
            <!-- Add other properties you want to display -->
        `;
        articleList.appendChild(articleDiv);
    });
}
