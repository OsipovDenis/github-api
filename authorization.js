//Класс для авторизации пользователя
class authorization {
  constructor(options) {
    this.options = options;
    //Переменная thisKeyInLocalStorage = ключ, если мы уже добавили юзера
    if (localStorage.getItem("thisKeyInLocalStorage") !== null) {

      this.login = localStorage.getItem("thisKeyInLocalStorage");
      this.keyBase64 = localStorage.getItem(this.login);

      this.formLogin = options.formLogin;
      this.formLogin.style.display = "none";

      this.avatar = options.avatar;
      this.avatar.style.display = "";
      this.avatar.src = localStorage.getItem("thisAvatar");

      this.btnLogout = options.btnLogout;
      this.btnLogout.style.display = "";

      this.getAllGists();
    } else {
      this.login = options.login;
      this.password = options.password;
    }
    // Управление формой авторизации
    this.formLogin = options.formLogin;
    this.submit = options.submit;
    this.btnLogout = options.btnLogout;
    this.avatar = options.avatar;

    // Управление созданием gist'a
    this.gistName = options.gistName;
    this.gistDescr = options.gistDescr;
    this.gistText = options.gistText;
    this.btnCreateGist = options.btnCreateGist;
    this.resultOutput = options.resultsOutput;
    this.compiledTemplate = options.compiledTemplate;

    // Обработчики
    this.btnCreateGist.onclick = this.addGist.bind(this);
    this.submit.onclick = this.sendForm.bind(this);
    this.btnLogout.onclick = this.logOut.bind(this);
  }

  sendForm(e) {
    e.preventDefault();

    if (this.login === null) {
      this.login = this.options.login;
      this.password = this.options.password;
    }

    this.keyBase64 = window.btoa(this.login.value + ':' + this.password.value);

    fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        "Authorization": `Basic ${this.keyBase64}`
      }
    }).then((response) => {
      if (response.status === 200) {
        localStorage.setItem(`${this.login.value}`, `${this.keyBase64}`);
        localStorage.setItem('thisKeyInLocalStorage', `${this.login.value}`);
      }
      return response.json();
    }).then((response) => {
      if (response.message == "Bad credentials") {
        return;
      }
      this.formLogin.style.display = "none";
      this.btnLogout.style.display = "";
      this.avatar.style.display = "";
      this.avatar.src = response.avatar_url;
      localStorage.setItem('thisAvatar', response.avatar_url);
      this.getAllGists();
    }).catch((error) => {
      alert("here" + error);
    })

  }

  logOut() {
    if (localStorage.getItem("thisKeyInLocalStorage")) {
      localStorage.removeItem(this.login);
      localStorage.removeItem("thisKeyInLocalStorage");
      localStorage.removeItem("thisAvatar");
      localStorage.clear();

      this.login = null;
      this.keyBase64 = null;

      this.resultOutput.innerHTML = "";

      this.btnLogout.style.display = "none";
      this.avatar.style.display = "none";
      this.formLogin.style.display = "";
    }
  }

  getAllGists() {
    fetch('https://api.github.com/gists', {
      method: 'GET',
      headers: {
        "Authorization": `Basic ${this.keyBase64}`
      }
    }).then((response) => {
      return response.json();
    }).then((response) => {
      // console.log(response);
      this.render(response);
    }).catch((error) => {
      alert(error);
    })
  }

  addGist() {
    let self = this;

    let gist = (function() {
      return {
        "description": self.gistDescr.value,
        "public": true,
        "files": {
          [self.gistName.value]: {
            "content": self.gistText.value
          }
        }
      }
    })();

    fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: {
        "Authorization": `Basic ${this.keyBase64}`
      },
      body: JSON.stringify(gist)
    }).then((response) => {
      return response.json();
    }).then((response) => {
      // console.log(response);
      this.getAllGists();
    }).catch((error) => {
      alert(error);
    });
  }

  render(data) {
    // console.log(data);
    this.resultOutput.innerHTML = this.compiledTemplate({
      arr: data
    });
  }
}
