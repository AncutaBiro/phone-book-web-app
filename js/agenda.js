
window.PhoneBook = {

  API_URL: 'http://localhost:8081/agenda',

  createAgenda: function () {
    let firstNameValue = $('#firstName-field').val();
    let lastNameValue = $('#lastName-field').val();
    let phoneNumberValue = $('#phoneNumber-field').val();
    let emailValue = $('#email-field').val();

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

  // cum sa sterg datele din field First Name si sa permit inserare de text si apoi salvarea?
  // in API, editarea/update pe contact se face dupa parametrii: id + firstName

  startEdit: function (id) {
    // let agenda = [];
    var editAgenda = this.getAgendaRowHtml.find(function (agenda) {
      console.log(agenda.firstName);
      return agenda.id === id;
    });
    console.debug('startEdit', editAgenda);

    $('#firstName-field').val(editAgenda.firstName);
    $('#lastName-field').val(editAgenda.lastName);
    $('#phoneNumber-field').val(editAgenda.phoneNumber);
    $('#email-field').val(editAgenda.email);
    editId = id;
  },

  updateAgenda: function (id, agenda) {
    let firstNameValue = $('#firstName-field').val();
    let lastNameValue = $('#lastName-field').val();
    let phoneNumberValue = $('#phoneNumber-field').val();
    let emailValue = $('#email-field').val();

    var requestBody = {
      firstName: firstNameValue,
      lastName: lastNameValue,
      phoneNumber: phoneNumberValue,
      email: emailValue,
    };

    $.ajax({
      url: PhoneBook.API_URL +'?id'+ id,
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

  cancelEdit: function() {
    editId = '';
    document.querySelector(".add-form").reset();
  },


  bindEvents: function () {
    $('.add-form').submit(function (event) {
      event.preventDefault();
      PhoneBook.createAgenda();
    });


    $('.add-form tbody').delegate('.edit-contact', 'click', function(event) {
      event.preventDefault();
      let id = $(this).data('id');
      PhoneBook.startEdit(id);
    });

    $('.add-form tbody').delegate ('.remove-contact', 'click', function (event) {
      event.preventDefault();
      let id = $(this).data('id');
      PhoneBook.deleteAgenda(id);
    })

  },

};

PhoneBook.getAgenda();
PhoneBook.bindEvents();


