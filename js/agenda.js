window.PhoneBook = {

  API_URL: 'http://localhost:8081/agenda',

  createAgenda: function () {
    let firstNameValue = $('#firstName').val();
    let lastNameValue = $('#lastName').val();
    let phoneNumberValue = $('#phoneNumber').val();
    let emailValue = $('#email').val();

    var requestBody = {
      firstName: firstNameValue,
      lastName: lastNameValue,
      phoneNumber: phoneNumberValue,
      email: emailValue,
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
    return `<tr>
            <td>${agenda.firstName}</td>
            <td>${agenda.lastName}</td>
            <td>${agenda.phoneNumber}</td>
            <td>${agenda.email}</td>
            <td>
              <a href="#" class="edit-contact" data-id=${agenda.id}>
                <i class="fa fa-pencil-square" aria-hidden="true"></i>
              </a>
              <a href="#" class="remove-contact" data-id=${agenda.id}>
                <i class="fa fa-trash"></i>
              </a>
            </td>
          </tr>`
  },

  bindEvents: function () {
    $('.add-form').submit(function (event) {
      event.preventDefault();
      PhoneBook.createAgenda();
    });
  }

};

PhoneBook.getAgenda();
PhoneBook.bindEvents();


