window.PhoneBook = {

  API_URL: 'http://localhost:8081/agenda',

  createAgenda: function () {
    let firstNameValue = $('#firstName-field').val();
    let lastNameValue = $('#lastName-field').val();
    let phoneNumberValue = $('#phoneNumber-field').val();
    let emailValue = $('#email-field').val();
    let favouriteValue = $('#favourite-field').val();

    var requestBody = {
      firstName: firstNameValue,
      lastName: lastNameValue,
      phoneNumber: phoneNumberValue,
      email: emailValue,
      favourite: favouriteValue,
    };
    $.ajax(
      {
        url: PhoneBook.API_URL,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestBody)
      }).done(function () {
      PhoneBook.getAgenda();
    });
  },

  updateAgenda: function (id, favourite) {
    const requestBody = {
      true : favourite
    };

    $.ajax({
      url: PhoneBook.API_URL + '?id' + id,
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(requestBody)
    }).done(function () {
      PhoneBook.getAgenda();
    });

  },

  deleteAgenda: function (id) {
    $.ajax({
      url: PhoneBook.API_URL + '?id=' + id,
      method: 'DELETE'
    }).done(function () {
      PhoneBook.getAgenda();
    });
  },

  getAgenda: function () {
    $.ajax({
      url: PhoneBook.API_URL,
    }).done(function (response) {
      PhoneBook.displayAgenda(JSON.parse(response));
    });
  },

  displayAgenda: function (agenda) {
    let rowsHtml = '';

    agenda.forEach(agenda => rowsHtml += PhoneBook.getAgendaRowHtml(agenda));

    $('.add-form tbody').html(rowsHtml);

  },

  getAgendaRowHtml: function (agenda) {

    let checkedAttribute = agenda.done? 'checked': '';

    return `<tr>
            <td>${agenda.firstName}</td>
            <td>${agenda.lastName}</td>
            <td>${agenda.phoneNumber}</td>
            <td>${agenda.email}</td>
            <td>
             <input type="checkbox" class="mark-done" data-id=${agenda.id} ${checkedAttribute}>
            </td>
            <td>
              <a href="#" class="edit-contact" title="Edit" data-id=${agenda.id}>
                <i class="fa fa-pencil-square" aria-hidden="true"></i>
              </a>
              <a href="#" class="remove-contact" title="Delete" data-id=${agenda.id}>
                <i class="fa fa-trash"></i>
              </a>
            </td>
          </tr>`
  },

// <!-- de ce nu raman incarcate datele in pagina web, la fiecare refresh dispar si apar dupa 1 sec???-->
  // te rog sa ma ajuti: cum sa incarc contactul in fieldul de create, sa il editez si apoi salvez???
  // in API metoda update cerea id si request-ul, oare mai trebuie adaugat inca un parametru?

  cancelEdit: function () {
    editId = '';
    document.querySelector(".add-form").reset();
  },


  bindEvents: function () {
    $('.add-form').submit(function (event) {
      event.preventDefault();
      PhoneBook.createAgenda();
      $('.add-form').trigger('reset');
    });

    $('.add-form tbody').delegate('.mark-done', 'change', function (event) {
      event.preventDefault();
      let id = $(this).data('id');
      let checked = $(this).is (':checked');
      PhoneBook.updateAgenda(id, checked);
    });

    $('.add-form tbody').delegate('.remove-contact', 'click', function (event) {
      event.preventDefault();
      let id = $(this).data('id');
      PhoneBook.deleteAgenda(id);
    })

  },

};

PhoneBook.getAgenda();
PhoneBook.bindEvents();


