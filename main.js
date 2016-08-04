//Класс для input'a
class classInput {
  constructor(options) {
    this.input = options.input;
    this.resultsOutput = options.resultsOutput;
    this.compiledTemplate = options.compiledTemplate;

    this.input.onkeyup = this.keyUp.bind( this );
    this.input.onkeydown = this.keyDown.bind( this );
  }

  keyUp(e) {
    let self = this;
    if (e.target.value.length < 3) {
      console.log("Мало символов");
    } else {
      this.timer = setTimeout(() => {
        fetch('https://api.github.com/search/repositories?q=' + e.target.value, {
          method: 'GET'
        }).then(( response ) => {
          return response.json();
        }).then(( response ) => {
          let firstThree = response.items.splice(0, 3)
            // console.log(firstThree);
          self.render(firstThree);
        }).catch(( error ) => {
          alert(error);
        })
      }, 1500);
    }

  }

  keyDown() {
    clearTimeout( this.timer );
  }

  render(data) {
    // console.log(data);
    this.resultsOutput.innerHTML = this.compiledTemplate({
      arr: data
    });
  }
}

//Класс для Gist'a
class classGist {
  constructor(options) {
    this.gistName = options.gistName;
    this.gistText = options.gistText;
    this.btnCreateGist = options.btnCreateGist;
    this.resultsOutput = options.resultsOutput;

    this.btnCreateGist.onclick = this.addGist.bind( this );
  }

  addGist() {
    let self = this;

    //Тело объекта gist'a, который отправляем на сервер.
    let gist = (function() {
      return {
        "description": "howework github api",
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
      body: JSON.stringify(gist)
    }).then(( response ) => {
      return response.json();
    }).then(( response ) => {
      this.render(response);
    }).catch( (error ) => {
      alert(error);
    })
  }

  render(data) {
    // console.log( data.html_url );
    this.resultsOutput.innerHTML = `<a href="${data.html_url}">${data.html_url}</a>`;
  }
}
