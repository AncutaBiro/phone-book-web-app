var contacts = [];
var editId;

window.PhoneBook = {

  API_URL: 'http://localhost:8081/agenda',

  getAgendaRowHtml: function (agenda) {
    return `<tr>
            <td>${agenda.firstName}</td>
            <td>${agenda.lastName}</td>
            <td>${agenda.phoneNumber}</td>
            <td>${agenda.email}</td>
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

  createAgenda: function (agenda) {
    // let firstNameValue = $('#firstName-field').val();
    // let lastNameValue = $('#lastName-field').val();
    // let phoneNumberValue = $('#phoneNumber-field').val();
    // let emailValue = $('#email-field').val();
    //
    // var requestBody = {
    //   firstName: firstNameValue,
    //   lastName: lastNameValue,
    //   phoneNumber: phoneNumberValue,
    //   email: emailValue,
    // };

    $.ajax(
      {
        url: PhoneBook.API_URL,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(agenda),
      }).done(function (response) {
      if (response.success) {
        PhoneBook.cancelEdit();
        PhoneBook.getAgenda();
      }
    });
  },

  updateAgenda: function (id, agenda) {
    let firstNameValue = $('#firstName-field').val();
    let lastNameValue = $('#lastName-field').val();
    let phoneNumberValue = $('#phoneNumber-field').val();
    let emailValue = $('#email-field').val();
    let favourite = $('#favourite').val();

    var requestBody = {
      firstName: firstNameValue,
      lastName: lastNameValue,
      phoneNumber: phoneNumberValue,
      email: emailValue,
      favourite: favourite,
    };

    console.log (id);
    $.ajax({
      url: PhoneBook.API_URL + '?id=' + id,
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(requestBody),
    }).done(function (response) {
      if (response.success) {
        PhoneBook.cancelEdit();
        console.log (id);
        PhoneBook.updateAgenda(agenda);
      }
    });
  },

  deleteAgenda: function (id) {
    $.ajax({
      url: PhoneBook.API_URL + '?id=' + id,
      method: 'DELETE',
    }).done(function (response) {
      if (response.success) {
        // PhoneBookLocalActions.delete(id);
        PhoneBook.getAgenda();
      }
    });
  },

  bindEvents: function () {

    $('.add-form').submit(function (event) {
      event.preventDefault();
      const agenda = {
        firstName: $('#firstName-field').val(),
        lastName: $('#lastName-field').val(),
        phoneNumber: $('#phoneNumber-field').val(),
        email: $('#email-field').val(),
        // favourite: $('#favourite-field').val(),
      };

      if (editId) {
        agenda.id = editId;
        let id = $(this).data('id');
        console.log(id)
        PhoneBook.updateAgenda(id, agenda);
      } else {
        PhoneBook.createAgenda(agenda);
      }
    });


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

  },

  startEdit: function (id) {

    var editContact = contacts.find(function(agenda) {
      return agenda.id == id;
    });
    console.log('startEdit', id);

    $('input[name=firstName]').val(editContact.firstName);
    $('input[name=lastName]').val(editContact.lastName);
    $('input[name=phoneNumber]').val(editContact.phoneNumber);
    $('input[name=email]').val(editContact.email);
    editId = id;
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
  // add: agenda => {
  //   agenda.id = new Date().getTime();
  //   contacts.push(agenda);
  //   PhoneBook.displayAgenda(contacts);
  // },
  // delete: id => {
  //   var remainingContacts = JSON.parse(contacts).filter(agenda => agenda.id !== id);
  //   window.contacts = remainingContacts;
  //   PhoneBook.displayAgenda(remainingContacts);
  // },

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
