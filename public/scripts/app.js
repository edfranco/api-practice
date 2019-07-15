//----------GLOBAL VARIABLES------//
const BASE_URL = '/api/v1/cities'
const cityTemplate = city => {
    return `
    <div id="${city._id}">
    <h4 class="city-name">${city.name}</h4>
    <p class="description">${city.description}</p>
    <button class="delete-button" >&times;</button>
    <button class="edit-button">Edit</button>
    </div>
    `
}

// DOM Elements
const newCityForm = document.getElementById('newCityForm');
const cities = document.getElementById(`cities`);


//functions
const allCitiesSucess = res => {
    const { data } = res;
    console.log(data)
    cities.innerHTML = '';
    data.forEach(city => {
        const template = cityTemplate(city);
        cities.insertAdjacentHTML('afterbegin', template)
    })
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

const handleEditClick = event => {
    if (event.target.classList.contains('edit-button'));
    editCity(event);
}

const editCity = event => {
    const cityName = event.target.parentNode.childNodes[1].innerText;
    const cityDescription = event.target.parentNode.childNodes[3].innerText;


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


//==== AJAX Calls =====
const getAllCities = () => {
    $.ajax({
        method: 'GET',
        url: BASE_URL,
        success: allCitiesSucess,
        error: allCitiesError,
    });
};

const addNewCity = event => {
    event.preventDefault();
    const inputName = event.target[0].value;
    const inputDescription = event.target[1].value;
    const newData = {
        name: inputName,
        description: inputDescription
    }
    console.log(JSON.stringify(newData));
    $.ajax({
        method: 'POST',
        url: BASE_URL,
        data: JSON.stringify(newData),
        success: newCitySuccess,
        error: newCityError,

    })
}

const updateCity = event => {
    event.preventDefault();
    console.log(event)
    const id = event.target.parentNode.parentNode.id;
    const cityName = event.target.parentNode.children;
    const cityDescription = $('#editCityDescription').val();
    const newCity = {
        name: $cityName,
        description: $cityDescription
    }
    $.ajax({
        method: 'PUT',
        url: `${BASE_URL}/${id}`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(newCity),
        success: () => {
            getAllCities();
        },
        error: error => console.log(error)

    })
}

const deleteCity = event => {
    const cityId = event.target.parentNode.id;
    $.ajax({
        method: 'DELETE',
        url: `${BASE_URL}/${cityId}`,
        success: res => getAllCities(),
        error: error => console.log(error),
    })
}



getAllCities()

// Event listeners
newCityForm.addEventListener('submit', addNewCity);
$('#cities').on('click', '.delete-button', deleteCity);
cities.addEventListener('click', handleEditClick);
$('#cities').on('click', '.cancel-edit', getAllCities);
$('#cities').on('click', '.submit-edit', updateCity);