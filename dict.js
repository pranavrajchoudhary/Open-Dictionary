let apiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";

let meaningContainer = document.querySelector('.meaning');
let searchButton = document.querySelector('button');
let inputField = document.querySelector('input');
let audioElement = document.querySelector('audio');
let resultSection = document.querySelector('section');

searchButton.addEventListener('click', async () => {
    let searchedWord = inputField.value;
    let dictionaryResult = await fetchDictionaryData(searchedWord);

    if (dictionaryResult[1] == '') {
        resultSection.innerHTML = "<h3>Sorry! Sound not available</h3>";
    } else {
        resultSection.innerHTML = `
            <h2>Listen how to speak</h2>
            <audio controls>
                <source src='${dictionaryResult[1]}' type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>`;
    }

    meaningContainer.innerHTML = `Meaning of <b>${searchedWord.toUpperCase()}</b> : ${dictionaryResult[0]}`;
    inputField.value = '';
});

async function fetchDictionaryData(word) {
    try {
        let response = await axios.get(apiUrl + word);
        let definition = response.data[0].meanings[0].definitions[0].definition;
        let audioUrl = response.data[0].phonetics.find(p => p.audio)?.audio || '';

        return [definition, audioUrl];
    } catch (error) {
        meaningContainer.innerText = '';
        resultSection.innerHTML = "Some error occurred! Please check the spelling or try a different word. We might not have that word in our database.";
    }
}
