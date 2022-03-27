const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
let quote = ""
let time = 60;
let timer = "";
let errors = 0;
const quoteSection = document.getElementById("test-text");
const userInput = document.getElementById("type-box");

//Display random quotes
const renderNewQuote = async () => {
    //Fetch contents from url
    const response = await fetch(quoteApiUrl);
  
    //Store response
    let data = await response.json();
  
    //Access quote
    quote = data.content;
    //console.log(quote);

    //Array of characters in the quote
    let arr = quote.split("").map((value) => {
        //wrap teh characters in a span tag
        return "<span class='quote-chars'>" + value + "</span>"
    });
    //join array for displaying
    quoteSection.innerHTML = arr.join("");
}



//Logic for comparing input words with quote

userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");
    //create array from received span tags
    quoteChars = Array.from(quoteChars);

    //array of usr input characters
    let userInputChars = userInput.value.split("");

    //loop through each charater in quote
    quoteChars.forEach((char, index) => {
        //Check if char(quote character) = userInputChars[index](input character)
        if (char.innerText == userInputChars[index]){
            char.classList.add("success");
        }
        //If user hasn't entered anything or backspaced
        else if (userInputChars[index] == null){
            //Remove class if any
            if(char.classList.contains("success")){
                char.classList.remove("success");
            } else if(char.classList.contains("fail")) {
                char.classList.remove("fail");
                errors -= 1
            }
            document.getElementById("count-of-errors").innerText = errors;
        }
        //if user enter wrong character
        else {
            if(!char.classList.contains("fail")){
                //increment and display mistakes
                errors += 1;
                char.classList.add("fail");
            }
            document.getElementById("count-of-errors").innerText = errors;
        }
        //Returns true if all the characters are entered correctly
        let check = quoteChars.every((element) => {
            return element.classList.contains("success");
        });
        //console.log(check);
        if(check) {
            displayResult();
        }
    });
    //console.log(quoteChars);
   
    
});

//Update timer on screen
function updateTimer(){
    if(time == 0){
        //End test if timer reaches 0
        displayResult();
    } else {
        time = time - 1;
        document.getElementById('timer').innerText = time + "s";
    }
}

//Sets timer

const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
}

//End test

const displayResult = () => {

    clearInterval(timer);
    userInput.disabled = true;
    let timeTaken = 1;
    if (time != 0) {
        timeTaken = (60 - time) / 100;
      }
    const wpm = document.createElement('div');
    wpm.setAttribute('class', 'data');

    const header_wpm = document.createElement('h5');
    header_wpm.innerText = "WPM";
    

    const para_wpm = document.createElement('p');
    para_wpm.setAttribute('id', 'words-per-minute');
    para_wpm.innerText = (userInput.value.length / 5 / timeTaken).toFixed(2)

    wpm.append(header_wpm);
    wpm.append(para_wpm);

    document.getElementById("accuracy").innerText =
    Math.round(
      ((userInput.value.length - errors) / userInput.value.length) * 100
    ) + " %";

    const cpm = document.createElement('div');
    cpm.setAttribute('class', 'data');

    const header_cpm = document.createElement('h5');
    header_cpm.innerText = "CPM";
    

    const para_cpm = document.createElement('p');
    para_cpm.setAttribute('id', 'char-per-minutes');
    para_cpm.innerText = userInput.value.length;

    cpm.append(header_cpm);
    cpm.append(para_cpm);


    const errorElement = document.getElementById('err');

    errorElement.before(cpm);
    cpm.before(wpm);
    
    const button = document.querySelector('.button-21');
    button.innerText="Click to Start Over"
    button.onclick = ()=>window.location.reload();

}

//Start Test

    startTest = ()=>{
        renderNewQuote();
        errors = 0;
        timer = "";
        userInput.disabled = false;
        timeReduce();
    };


        