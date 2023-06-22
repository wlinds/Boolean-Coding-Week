const loading = document.querySelector('.loading') // Create variables

const modal = document.querySelector('.modal')
const modalContent = document.querySelector('.modal-content')
const modalClose = document.querySelector('.modal-close')

// query selector only gets first found
// querySelectorAll gets ALL occurrences
const bowlSlots = document.querySelectorAll('.bowl-slot')

const cookBtn = document.querySelector('.cook-btn')

cookBtn.addEventListener('click', createRecipe)

// Run function on click
modalClose.addEventListener('click', function() {
    modal.classList.add('hidden')
    clearBowl()
})

// Clear array
function clearBowl() {
    bowl = []
    bowlSlots.forEach(function (el) {
        el.innterText = '?'
    })

}

// array
const bowl = []
// const maxBowlSlots = 3 //hardcoded to 3. instead we get it from bowlSlots:
const maxBowlSlots = bowlSlots.length

// '===' = comparison operator used to check for strict equality between two values
function addIngredient(ingredient) {
    if (bowl.length === maxBowlSlots) {
        //if statement
        console.log('Bowl is full! Shifting..')

        bowl.shift()
        return

    }

    bowl.push(ingredient)
    console.log(bowl)

    // Check the slots if ingredient is added, use moji instead of '?'

    bowlSlots.forEach(function (el, i) {
        let selectedIngredient = '?'
        
        if (bowl[i]) {
            selectedIngredient = bowl[i]
        }

        el.innerText = selectedIngredient
    })

    if (bowl.length === maxBowlSlots) {
        cookBtn.classList.remove('hidden')
    }


}

async function makeRequest(endpoint, data) {
    const response = await fetch(_CONFIG_.API_BASE_URL + endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${_CONFIG_.API_KEY}`
        },
        method: 'POST',
        body: JSON.stringify(data)
    })

    return await response.json

}


function randomLoadingMessage() {
    const messages = [
        'Prepping the ingredients...',
        'Stove is heating up...',
        'Gathering resources...',
        "Preparing the ingredients...",
        "Warming up the stove...",
        "Gathering all the necessary resources...",
        "Getting everything ready for cooking...",
        "Ensuring the ingredients are prepped...",
        "Heating up the stove for the recipe...",
        "Collecting the required resources...",
        "Preparing all the necessary items...",
        "Setting the stage for cooking...",
        "Assembling the ingredients and tools...",
    ]

    const loadingMessage = document.querySelector('.loading-message')

    loadingMessage.innerText = messages[0]

    // Change the message every few seconds

    return setInterval(function () {
        const randomIndex = Math.floor(Math.random() * messages.length)
        loadingMessage.innerText = messages[randomIndex]

    }, 200)
}

async function createRecipe() {
    let randomMessageInterval = randomLoadingMessage();
    loading.classList.remove('hidden');

    const result = await makeRequest('/chat/completions', {
        model: _CONFIG_.GPT_MODEL,
        messages: [
            {
                role: 'user',
                content: `Create a recipe with these ingredients: ${bowl.join(', ')}. The recipe should be easy and with a creative and fun title. Your replies should be in JSON format like this example :### {"title": "Recipe title", "ingredients": "1 egg, 1 tomato", "instructions": "mix the ingredients and put in the oven"}###`
            }
        ],
        temperature: 0.7
    })

    const content = JSON.parse(result.choices[0].message.content)

    modalContent.innerHTML = `
        <h2>${content.title}</h2>
        <p>${content.ingredients}</p>
        <p>${content.instructions}</p>
    `;

    modal.classList.remove('hidden')
    loading.classList.add('hidden')

    clearInterval(randomMessageInterval)

}



function init() {
    // add clickevent to all ingredients

    const ingredients = document.querySelectorAll('.ingredient')

    ingredients.forEach(function (el) {
        el.addEventListener('click', function (){
            addIngredient(el.innerText)
        })
    })
}

init()

// document.querySelector('.loading').classList.remove('hidden') //Pull the CSS class