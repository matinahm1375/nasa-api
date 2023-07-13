const resultNav = document.getElementById('resultsNav');
const favoriteNav = document.getElementById('favoriteNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// Nasa API
const apiKey = 'vPOSBtTMKX1o34CAyuJXzY0AeeeLEQDLaOFS3DKD';

const count = 10
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultArray = [];
let favorites = {};

function showContent(page){
    window.scrollTo({ top:0, behavior:'instant'});
    if (page === 'results') {
        resultNav.classList.remove('hidden');
        favoriteNav.classList.add('hidden');
    } else {
        resultNav.classList.add('hidden');
        favoriteNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}


function createDOMNodes(page){
    const currentArray = page ==='results'? resultArray:Object.values(favorites);
    currentArray.forEach((result) => {
        //card container
        const card =document.createElement('div');
        card.classList.add('card');
      // link 
      const link = document.createElement('a');
      link.href = result.hdurl;
      link.title = 'view full image';
      link.target='_blank';
      // image
      const image = document.createElement('img');
      image.src = result.url;
      image.alt = 'nasa picture of the day';
      image.loading = 'lazy';
      image.classList.add('card-img-top');
      // card body 
      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');
    // card title 
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent=result.title;
    // save text 
    const saveText = document.createElement('p');
    saveText.classList.add('clickable');
    if (page==='results'){
        saveText.textContent = 'add to favorites';
        saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
    }else{
        saveText.textContent = 'Remove Favorite';
        saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
    }
    //card text
    const cardText = document.createElement('p');
    cardText.textContent=result.explanation;
    //footer container 
    const footer = document.createElement('small');
    footer.classList.add('text-muted');
    //date 
    const date = document.createElement('strong');
    date.textContent=result.date;
    //copy right
    const copyRightResult = result.copyRight===undefined? '':result.copyRight
    const copyRight = document.createElement('span');
    copyRight.textContent=`_${copyRightResult}`;
    // Append 
    footer.append(date,copyRight);
    cardBody.append(cardTitle,saveText,cardText,footer);
    link.appendChild(image);
    card.append(link,cardBody);
   imagesContainer.appendChild(card);
    });
}


function updateDom(page) {
    //get favorite from local storage
    if (localStorage.getItem('nasaFavorites')){
        favorites=JSON.parse(localStorage.getItem('nasaFavorites'))
    }
    imagesContainer.textContent='';
    createDOMNodes(page);
    showContent(page);
   
}
// Get 10 images from nasa apod
async function getNasaPicture () {
    //show loader
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultArray = await response.json();
        updateDom('results');
    } catch (error) {
        // catch error here
    }
}

//add result to favorites

function saveFavorite(itemUrl){
   //loo throug results array to select favorite
   resultArray.forEach((item)=>{
    if(item.url.includes(itemUrl)&& !favorites[itemUrl]){
        favorites[itemUrl]=item;
        //show save confirmation for 2seconds
        saveConfirmed.hidden = false;
        setTimeout(()=>{
            saveConfirmed.hidden=true;
        },2000); 
        // set favorites in localstorage
        localStorage.setItem('nasaFavorites',JSON.stringify(favorites));    
    }
   });
}

// remove item from favorite 
function removeFavorite(itemUrl){
    if (favorites[itemUrl]){
        delete favorites [itemUrl];
        // set favorites in localstorage 
        localStorage.setItem('nasaFavorites',JSON.stringify(favorites));
        updateDom('favorites'); 
    }
}

//on load
getNasaPicture();
{{{{{{{{{{{{{}}}}}}}}}}}}}