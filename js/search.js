(function(){
  // Toggle function for search bar
  function toggleSearchBar() {
    console.log('Toggle search bar function called');
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
      console.log('Found search bar:', searchBar);
      console.log('Current classes:', searchBar.className);
      searchBar.classList.toggle('close');
      console.log('New classes:', searchBar.className);
    } else {
      console.error('Search bar not found!');
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    // Add click event listener to search toggle button
    const searchButton = document.querySelector('.toggle-button[data-target="search-bar"]');
    if (searchButton) {
      console.log('Found search toggle button:', searchButton);
      searchButton.addEventListener('click', function(e) {
        e.preventDefault();
        toggleSearchBar();
      });
    } else {
      console.error('Search toggle button not found!');
    }
    
    // Close search bar when clicking outside
    document.addEventListener('click', function(e) {
      const searchBar = document.getElementById('search-bar');
      const searchButton = document.querySelector('.toggle-button[data-target="search-bar"]');
      if (searchBar && !searchBar.classList.contains('close') &&
          !searchBar.contains(e.target) &&
          !(searchButton && searchButton.contains(e.target))) {
        searchBar.classList.add('close');
        console.log('Closed search bar from outside click');
      }
    });
  });
})();