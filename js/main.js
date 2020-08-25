var contacts = [];
var editId;

window.PhoneBook = {

  API_URL: 'http://localhost:8081/agenda',

  getAgendaRowHtml: function (agenda) {

    let checkedAttribute = agenda.favourite? 'checked' : '';

    return `<tr>
            <td>${agenda.firstName}</td>
            <td>${agenda.lastName}</td>
            <td>${agenda.phoneNumber}</td>
            <td>${agenda.email}</td>
            <td>
             <input type="checkbox" class="mark-done" data-id=${agenda.id} ${checkedAttribute}>
            </td>
            <td>
              <a href="#" class="edit" title="Edit" data-id=${agenda.id}>
                <i class="fa fa-pencil-square" aria-hidden="true"></i>
              </a>
              <a href="#" class="delete" title="Delete" data-id=${agenda.id}>
                <i class="fa fa-trash"></i>
              </a>
            </td>
          </tr>`
  },

  getAgenda: function () {
    $.ajax({
      url: PhoneBook.API_URL,
      method: 'GET',
    }).done(function (contacts) {
      PhoneBookLocalActions.load(contacts);
      PhoneBook.displayAgenda(contacts);
    });
  },

  displayAgenda: function (contacts) {
    let rowsHtml = '';
    JSON.parse(contacts).forEach(agenda => rowsHtml += PhoneBook.getAgendaRowHtml(agenda));
    $('.add-form tbody').html(rowsHtml);
  },

  createAgenda: function () {

    let firstNameValue = $('#firstName-field').val();
    let lastNameValue = $('#lastName-field').val();
    let phoneNumberValue = $('#phoneNumber-field').val();
    let emailValue = $('#email-field').val();
    let favouriteValue = $('#mark-done').val();

    var requestBody = {
      firstName: firstNameValue,
      lastName: lastNameValue,
      phoneNumber: phoneNumberValue,
      email: emailValue,
      favourite: favouriteValue,};

    $.ajax(
      {
        url: PhoneBook.API_URL,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestBody),
      }).done(function () {
        PhoneBook.cancelEdit();
        PhoneBook.getAgenda();

    });
  },

  updateAgenda: function (editId, agenda) {
    let firstNameValue = $('#firstName-field').val();
    let lastNameValue = $('#lastName-field').val();
    let phoneNumberValue = $('#phoneNumber-field').val();
    let emailValue = $('#email-field').val();
    let favourite = $('#mark-done').val();

    var requestBody = {
      firstName: firstNameValue,
      lastName: lastNameValue,
      phoneNumber: phoneNumberValue,
      email: emailValue,
      favourite: favourite,
    };

    $.ajax({
      url: PhoneBook.API_URL + '?id=' + editId,
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(requestBody),
    }).done(function () {
        PhoneBook.cancelEdit();
        PhoneBook.getAgenda()

    });
  },

  deleteAgenda: function (id) {
    $.ajax({
      url: PhoneBook.API_URL + '?id=' + id,
      method: 'DELETE',
    }).done(function () {
        PhoneBook.getAgenda();

    });
  },

  bindEvents: function () {

    $('.add-form tbody').delegate('a.edit', 'click', function (event) {
      event.preventDefault();
      let id = $(this).data('id');
      PhoneBook.startEdit(id);
    });

    $('.add-form tbody').delegate('a.delete', 'click', function (event) {
      event.preventDefault();
      let id = $(this).data('id');
      PhoneBook.deleteAgenda(id);
    });

    $('.add-form').submit(function (event) {
      event.preventDefault();

      const agenda = {
        firstName: $('#firstName-field').val(),
        lastName: $('#lastName-field').val(),
        phoneNumber: $('#phoneNumber-field').val(),
        email: $('#email-field').val(),
        checked : $(this).is(':checked'),
      };

      if (editId) {
        agenda.id = editId;
        PhoneBook.updateAgenda(editId, agenda);
      } else {
        PhoneBook.createAgenda(agenda);
      }
    });
  },

  startEdit: function (id) {

    var editContact = contacts.find(function(agenda) {
      return agenda.id == id;
    });

    $('input[name=firstName]').val(editContact.firstName);
    $('input[name=lastName]').val(editContact.lastName);
    $('input[name=phoneNumber]').val(editContact.phoneNumber);
    $('input[name=email]').val(editContact.email);
    $('input[name=favourite]').val(editContact.favourite);
    editId = id;
    console.log('startEdit', editId)
  },

  cancelEdit: function () {
    editId = '';
    document.querySelector(".add-form").reset();
  },

};

window.PhoneBookLocalActions = {
  load: (contacts) => {
    window.contacts = JSON.parse(contacts);
  },

  update: agenda => {
    const id = agenda.id;
    var agendaToUpdate = contacts.find(agenda => agenda.id === id);
    agendaToUpdate.firstName = agenda.firstName;
    agendaToUpdate.lastName = agenda.lastName;
    agendaToUpdate.phoneNumber = agenda.phoneNumber;
    agendaToUpdate.email = agenda.email;
    agendaToUpdate.favourite = agenda.favourite;
    PhoneBook.displayAgenda(contacts);
  },

};

PhoneBook.getAgenda();
PhoneBook.bindEvents();
