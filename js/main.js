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
              <a href="#" class="edit-contact" title="Edit" data-id=${agenda.id}>
                <i class="fa fa-pencil-square" aria-hidden="true"></i>
              </a>
              <a href="#" class="remove-contact" title="Delete" data-id=${agenda.id}>
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
      PhoneBook.displayAgenda(JSON.parse(contacts));
    });
  },

  displayAgenda: function (contacts) {
    let rowsHtml = '';
    contacts.forEach(agenda => rowsHtml += PhoneBook.getAgendaRowHtml(agenda));
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
        data: agenda,
        // JSON.stringify(requestBody)
      }).done(function (response) {
      if (response.success) {
        PhoneBook.cancelEdit();
        PhoneBookLocalActions.createAgenda(agenda);
      }
    });
  },

// <!-- de ce nu raman incarcate datele in pagina web, la fiecare refresh dispar si apar dupa 1 sec???-->
  // te rog sa ma ajuti: cum sa incarc contactul in fieldul de create, sa il editez si apoi salvez???
  // in API metoda update cerea id si request-ul, oare mai trebuie adaugat inca un parametru?

  updateAgenda: function (agenda) {
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

    $.ajax({
      url: PhoneBook.API_URL + '?id=' + id,
      method: 'PUT',
      contentType: 'application/json',
      data: agenda,
      // JSON.stringify(requestBody)
    }).done(function (response) {
      if (response.success) {
        PhoneBook.cancelEdit();
        PhoneBookLocalActions.update(agenda);
      }
    });
  },

  deleteAgenda: function (id) {
    $.ajax({
      url: PhoneBook.API_URL + '?id=' + id,
      method: 'DELETE',
    }).done(function (response) {
      if (response.success) {
        // PhoneBook.getAgenda();
        PhoneBookLocalActions.delete(id);
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
      };

      if (editId) {
        agenda.id = editId;
        PhoneBook.updateAgenda(agenda);
      } else {
        PhoneBook.createAgenda(agenda);
      }
      $('.add-form').trigger('reset');
    });


    $('.add-form tbody').delegate('.edit-contact', 'click', function (event) {
      event.preventDefault();
      let id = $(this).data('id');
      PhoneBook.startEdit(id);
    });

    $('.add-form tbody').delegate('.remove-contact', 'click', function (event) {
      event.preventDefault();
      let id = $(this).data('id');
      PhoneBook.deleteAgenda(id);
    });

  },

  startEdit: function (id) {
    var editContact = contacts.find(function(agenda) {
      console.log(agenda.firstName);
      return agenda.id == id;
    });
    console.debug('startEdit', editContact);

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
    // save in persons as global variable
    window.contacts = contacts;
  },
  // ES6 functions (one param - no need pharanteses for arguments)
  add: agenda => {
    agenda.id = new Date().getTime();
    contacts.push(agenda);
    PhoneBook.displayAgenda(contacts);
  },
  delete: id => {
    var remainingContacts = contacts.filter(agenda => agenda.id !== id);
    window.contacts = remainingContacts;
    PhoneBook.displayAgenda(remainingContacts);
  },
  update: agenda => {
    const id = agenda.id;
    var agendaToUpdate = contacts.find(agenda => agenda.id === id);
    agendaToUpdate.firstName = agenda.firstName;
    agendaToUpdate.lastName = agenda.lastName;
    agendaToUpdate.phoneNumber = agenda.phoneNumber;
    agendaToUpdate.email = agenda.email;
    PhoneBook.displayAgenda(contacts);
  }

};

PhoneBook.getAgenda();
PhoneBook.bindEvents();
