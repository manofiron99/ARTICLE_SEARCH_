// Retrieve parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
const title = urlParams.get('title');
const summary = urlParams.get('summary');
const authors = urlParams.get('authors');
const publishedDate = urlParams.get('publishedDate');

// Display metadata details
document.getElementById("metadataTitle").textContent = title;
document.getElementById("metadataSummary").textContent = summary;
document.getElementById("metadataAuthors").textContent = authors;
document.getElementById("metadataPublishedDate").textContent = publishedDate;
document.getElementById("downloadMetadata").setAttribute("href", createDownloadUrl(title, summary, authors, publishedDate));

// Function to create a download URL
function createDownloadUrl(title, summary, authors, publishedDate) {
    // Customize the download URL based on your needs
    return `https://yourdomain.com/download?title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}&authors=${encodeURIComponent(authors)}&publishedDate=${encodeURIComponent(publishedDate)}`;
}
