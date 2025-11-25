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
  
  function debounce(fn, delay){
    let t; return function(){
      const ctx=this, args=arguments;
      clearTimeout(t); t=setTimeout(function(){fn.apply(ctx,args);}, delay);
    };
  }

  function createResultsContainer(){
    var container=document.getElementById('search-results');
    if(!container){
      var bar=document.getElementById('search-bar');
      container=document.createElement('div');
      container.id='search-results';
      container.className='mt-3';
      bar && bar.appendChild(container);
    }
    return container;
  }

  var indexCache=null, indexPromise=null;
  function loadIndex(){
    if(indexCache) return Promise.resolve(indexCache);
    if(indexPromise) return indexPromise;
    indexPromise = fetch('/index.json',{credentials:'same-origin'})
      .then(function(r){return r.json();})
      .then(function(json){ indexCache=json; return json; })
      .catch(function(err){ console.error('Search index load error:', err); return []; });
    return indexPromise;
  }

  function normalize(s){ return (s||'').toString().toLowerCase(); }

  function matchItem(item, q){
    var nq = normalize(q);
    if(!nq) return false;
    if(normalize(item.title).includes(nq)) return true;
    if(normalize(item.description).includes(nq)) return true;
    if(normalize(item.content).includes(nq)) return true;
    if(Array.isArray(item.tags) && item.tags.some(function(t){return normalize(t).includes(nq);} )) return true;
    if(Array.isArray(item.categories) && item.categories.some(function(c){return normalize(c).includes(nq);} )) return true;
    return false;
  }

  function renderResults(items, q){
    var container = createResultsContainer();
    container.innerHTML = '';
    if(!q){ return; }
    if(!items || items.length===0){
      container.innerHTML = '<p class="text-sm text-zinc-500">未找到匹配结果</p>';
      return;
    }
    var ul=document.createElement('ul');
    ul.className='space-y-2';
    items.slice(0,20).forEach(function(it){
      var li=document.createElement('li');
      li.className='flex flex-col';
      var a=document.createElement('a');
      a.className='decoration-auto hover:underline font-semibold';
      a.href=it.permalink; a.textContent=it.title;
      var small=document.createElement('span');
      small.className='text-sm text-zinc-500';
      var desc = it.description || '';
      if(!desc){ desc = (it.content||'').slice(0,140); }
      small.textContent = desc;
      li.appendChild(a); li.appendChild(small);
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }

  function handleQuery(q){
    loadIndex().then(function(idx){
      var results = idx.filter(function(item){ return matchItem(item,q); });
      renderResults(results, q);
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    // Initialize search functionality
    var form = document.getElementById('search');
    if(!form) return;
    var input = form.querySelector('input[name="q"]') || form.querySelector('input');
    if(!input) return;

    var onInput = debounce(function(){
      var q = input.value.trim(); handleQuery(q);
    }, 250);

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var q = input.value.trim(); handleQuery(q);
    });

    input.addEventListener('input', onInput);
    
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