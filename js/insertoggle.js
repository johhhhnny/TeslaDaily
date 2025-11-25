// Simple toggle functionality for search button
document.addEventListener('DOMContentLoaded', function() {
    console.log('Toggle script loaded');
    
    // Get search button and search bar
    const searchButton = document.querySelector('.toggle-button[data-target="search-bar"]');
    const searchBar = document.getElementById('search-bar');
    
    console.log('Search button:', searchButton);
    console.log('Search bar:', searchBar);
    
    // Add click event to search button
    if (searchButton && searchBar) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Search button clicked!');
            searchBar.classList.toggle('close');
            console.log('Search bar classes:', searchBar.className);
        });
    }
    
    // Add click outside to close search bar
    document.addEventListener('click', function(e) {
        if (searchBar && !searchBar.classList.contains('close') &&
            !searchBar.contains(e.target) &&
            !e.target.closest('.toggle-button[data-target="search-bar"]')) {
            searchBar.classList.add('close');
            console.log('Closed search bar from outside click');
        }
    });
});