//----------GLOBAL VARIABLES------//
const BASE_URL = '/api/v1/cities'

// DOM Elements
const $newCityForm = $('#newCityForm');

//functions
const allCitiesSucess = res => {
    const { data } = res;
    $(`#cities`).empty()
    data.forEach(city => {
        const template = cityTemplate(city);
        $(`#cities`).prepend(template)
    })
}

const allCitiesError = err => {
    console.log(err)
}



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

const newCitySuccess = res => {
    getAllCities()
}

const newCityError = error => {
    console.log(error)
}



const editCity = event => {
    const $cityName = event.target.parentNode.childNodes[1].innerText;
    const $cityDescription = event.target.parentNode.childNodes[3].innerText;
    console.log(`Look at this`, $cityName, $cityDescription)

    $(event.target).parent().empty().html(`
    <h4>Edit ${$cityName}</h4>
    <form>
        <div>
            <label style="display: block;" for="city-name">City Name</label>
            <input type="text" id="editCityName" name="city-name" value="${$cityName}" />
        </div>
        <div>
            <label style="display: block;" for="city-description">City Description</label>
            <input type="text" id="editCityDescription" name="city-description" value="${$cityDescription}" />
        </div>
        <button type="button" class="cancel-edit">Cancel</button>
        <button type="button" class="submit-edit">Submit</button>
    </form>
    `);
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
    $.ajax({
        method: 'POST',
        url: BASE_URL,
        data: $newCityForm.serialize(),
        success: newCitySuccess,
        error: newCityError,

    })
}

const updateCity = event => {
    event.preventDefault();
    const id = event.target.parentNode.parentNode.id;
    const $cityName = $(`#editCityName`).val();
    const $cityDescription = $('#editCityDescription').val();
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
    const cityId = $(event.target).parent().attr('id');
    $.ajax({
        method: 'DELETE',
        url: `${BASE_URL}/${cityId}`,
        success: res => getAllCities(),
        error: error => console.log(error),
    })
}



getAllCities()

// Event listeners
$newCityForm.on('submit', addNewCity);
$('#cities').on('click', '.delete-button', deleteCity);
$('#cities').on('click', '.edit-button', editCity);
$('#cities').on('click', '.cancel-edit', getAllCities);
$('#cities').on('click', '.submit-edit', updateCity);