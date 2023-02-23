const secretAccess = () => {
    let haveSecretAccessCode = confirm('Click OK if you have the "Secret Access Code"');

    let secretAccess = {
       boolean: haveSecretAccessCode,
       code: '',
    }
    
    if (secretAccess?.boolean) {
       let promptValue = prompt('Enter the "Secret Access Code" to get the admin control without login : ');
       
       if (promptValue === process.env.secretAccessCode_myShop) {
          secretAccess.code = promptValue!;
       } else {
          secretAccess.boolean = false;
          (promptValue !== null) && alert('Wrong Access Code');
       }
    }
    sessionStorage.setItem('secret-access', JSON.stringify(secretAccess));

    if(secretAccess.code.length) return true;
    else return false;
}

export default secretAccess;
