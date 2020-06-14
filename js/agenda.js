window.PhoneBook = {

API_URL: 'http://localhost:8081/agenda',

  createAgenda: function () {
  let firstNameValue = $('#firstName').val();
  let lastNameValue = $('#lastName').val();
  let phoneNumberValue = $('#phoneNumber').val();

  var requestBody = {
    firstName: firstNameValue,
    lastName: lastNameValue,
    phoneNumber: phoneNumberValue,
  };
        $.ajax (
          {
            url:PhoneBook.API_URL,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestBody)
          }).done(function (response) {
            console.log(response);

        })
  },

  bindEvents: function (){
  $('#add-form').submit(function () {
    PhoneBook.createAgenda()
  });
}

};

PhoneBook.bindEvents();


