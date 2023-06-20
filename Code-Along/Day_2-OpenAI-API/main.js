
// Loading gif
const loading = document.querySelector('.loading');

// Modal HTML element and its content
const modal = document.querySelector('.modal');
const modalContent = modal.querySelector('.modal-content');
const modalClose = modal.querySelector('.modal-close');

// Event listener for close button
modalClose.addEventListener('click', function() {
    // Add the hidden css class when clicked
    modal.classList.add('hidden');
});

// Some kind of action for ChatGPT
function getRandomAction() {
    const actions = [
        'say hello in your most iconic way',
        'what is the meaning of life',
        'share your summary on ethics',
        'ask me a philosophical question'
    ];

    // Generate random number to select index from actions
    const randomIndex = Math.floor(Math.random() * actions.length)
    return actions[randomIndex];
}

async function playCharacter(character) {
    loading.classList.remove('hidden')

    const action = getRandomAction()



    const response = await fetch(_CONFIG_.API_BASE_URL + '/chat/completions', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${_CONFIG_.API_KEY}`
        },
        method: 'POST',
        body: JSON.stringify({
                model: _CONFIG_.GPT_MODEL,
                messages: [
                    {
                        role: 'user',
                        content: `You are ${character} and should ${action} in a maximum of 100 characters without breaking character.`
                    }
                ]
            })
    })

    const jsonData = await response.json()
    const content = jsonData.choices[0].message.content;

    modalContent.innerHTML = `
    <h2>${character}</h2>
    <p>${content}</p>
    <code>Character: ${character}. Action: ${action}.</code>
    `;

    modal.classList.remove('hidden');
    loading.classList.add('hidden');

}

// Create a function to run when the page loads
function init() {
    // Get all of the character HTML elements
    const characters = document.querySelectorAll('.character');

    // Add a click event to every character
    characters.forEach((el) => {
        el.addEventListener('click', function() {
            const character = el.dataset.character;
            // When the character is clicked, run the playCharacter function using the clicked character
            playCharacter(character);
        });
    });
}

init();