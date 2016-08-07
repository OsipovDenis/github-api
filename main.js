//Класс для input'a
//Умеет искать нужный репозиторий и выводить первые 3 популярных
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
