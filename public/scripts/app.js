//----------GLOBAL VARIABLES------//
const BASE_URL = '/api/v1/cities'
const cityTemplate = city => {
    return `
    <div class="cities" id="${city._id}">
        <div class="content-container">
            <h4 id="cityName" class="city-name">${city.name}</h4>
            <img id="cityDescription" src="" alt="City image goes here"/>
            <p class="description">${city.description}</p>
        </div>
        <div class="buttons-container">
            <button class="delete-button" >&times;</button>
            <button class="edit-button">Edit</button>
    </div>
    </div>
    `
}

// ====State ====
const state = {
    cities: []
}

// DOM Elements
const newCityForm = document.getElementById('newCityForm');
const cities = document.getElementById(`cities`);


//functions
const render = data => {
    cities.innerHTML = '';
    data.forEach(city => {
        const template = cityTemplate(city);
        cities.insertAdjacentHTML('afterbegin', template)
    })

}

const allCitiesSucess = res => {
    const { data } = res;
    state.cities = data;
}

const allCitiesError = err => {
    console.log(err)
}

const newCitySuccess = res => {
    getAllCities()
}

const newCityError = error => {
    console.log(error)
}



const editCity = event => {
    const cityName = document.getElementById('cityName').innerHTML;
    console.log(cityName)
    const cityDescription = document.getElementById('cityDescription').innerHTML;


    event.target.parentNode.innerHTML = `
    <h4>Edit ${cityName}</h4>
    <form>
        <div>
            <label style="display: block;" for="city-name">City Name</label>
            <input type="text" id="editCityName" name="city-name" value="${cityName}" />
        </div>
        <div>
            <label style="display: block;" for="city-description">City Description</label>
            <input type="text" id="editCityDescription" name="city-description" value="${cityDescription}" />
        </div>
        <button type="button" class="cancel-edit">Cancel</button>
        <button type="button" class="submit-edit">Submit</button>
    </form>
    `;
}


//==== Fetch Calls =====
const getAllCities = () => {
    fetch(BASE_URL)
        .then(res => res.json())
        .then(json => {
            state.cities = json.data;
            render(state.cities)
        })
        .catch(error => console.log(error))
};
getAllCities()

const addNewCity = event => {
    event.preventDefault();
    const inputName = event.target[0];
    const inputDescription = event.target[1];
    const newData = {
        name: inputName.value,
        description: inputDescription.value
    }

    fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)
        })
        .then(res => {
            inputName.value = '';
            inputDescription.value = '';
            inputName.focus();
            newCitySuccess(res)
        })
        .catch(err => console.log(err))
}

const updateCity = event => {
    const id = event.target.parentNode.parentNode.id;
    const cityName = document.getElementById('editCityName').value;
    const cityDescription = document.getElementById('editCityDescription').value;
    const newCity = {
        name: cityName,
        description: cityDescription
    }

    fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCity)
        })
        .then(res => {
            console.log(res);
            getAllCities()
        })
        .catch(err => console.log(err))
}

const deleteCity = event => {
    const cityId = event.target.parentNode.parentNode.id;
    console.log(event)
    fetch(`${BASE_URL}/${cityId}`, {
            method: 'DELETE'
        })
        .then(() => getAllCities())
        .catch(err => console.log(err))
}

const handleCitySectionClick = event => {
    event.preventDefault();
    if (event.target.classList.contains('edit-button')) {
        editCity(event);
    } else if (event.target.classList.contains('submit-edit')) {
        updateCity(event)
    } else if (event.target.classList.contains('delete-button')) {
        deleteCity(event)
    } else if (event.target.classList.contains('cancel-edit')) {
        getAllCities()
    }

}

// Event listeners
newCityForm.addEventListener('submit', addNewCity);
cities.addEventListener('click', handleCitySectionClick);