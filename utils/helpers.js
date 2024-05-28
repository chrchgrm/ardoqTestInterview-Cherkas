  // Function to generate a random integer between min and max (inclusive)
  function generateRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

 function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  
  // Generate a random email address
  function generateRandomEmail(username) {
    const domain = generateRandomString(5) + '.com';
    return `${username}@${domain}`;
  }

  function generateRandomAddress() {
    const streetNames = ['High Street', 'Main Street', 'Church Street', 'Station Road', 'London Road'];
    const randomStreetNumber = generateRandomInteger(1, 500);
    const randomStreetName = streetNames[Math.floor(Math.random() * streetNames.length)];
  
    const address = `${randomStreetNumber} ${randomStreetName}`;
    return address;
  }
  
  // Function to generate a random country ID between 1 and 239
    function generateRandomCountryId() {
    return generateRandomInteger(1, 239);
  }

  function generateRandomPassword(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}|[];:,.<>?';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
    }
    return password;
}
  
  module.exports = {
    generateRandomInteger,
    generateRandomString,
    generateRandomEmail,
    generateRandomAddress,
    generateRandomCountryId,
    generateRandomPassword
  };