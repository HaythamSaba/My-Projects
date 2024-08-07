//Select Elements 
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets")
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitBtn = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".contdown");
// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions(){
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function (){
    if (this.readyState === 4 && this.status === 200){
      let questionsObj = JSON.parse(this.responseText);
      let qCount = questionsObj.length;

      //Create Bullets + Set Question Count
      createBullets(qCount)

      // Add Question Data
      addQuestionData(questionsObj[currentIndex], qCount);

      // Start Countdown 
      contdown(5, qCount);
      // Click On Submit 
      submitBtn.onclick = () => {
        // Get Right Answer
        let theRightAnswer = questionsObj[currentIndex].right_answer;

        // Increase Index
        currentIndex++;

        // Check The Answer
        checkAnswer(theRightAnswer, qCount);

        // Remove Previos Question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        addQuestionData(questionsObj[currentIndex], qCount);

        // Handle Bullets Class
        handleBullets();

        // Start Countdown
        clearInterval(countdownInterval)
        contdown(5, qCount);

        // Show Results
        showResults(qCount);
      }
    }
  };
  myRequest.open("GET","html_questions.json", true);
  myRequest.send()
}
getQuestions();

function createBullets(num){
  countSpan.innerHTML = num;

  // Create Spans
  for (let i = 0; i < num; i++){
    let bulletSpan = document.createElement("span");
    // Check If Its First Span
    if (i === 0) {
      bulletSpan.className = "on";
    }
    // Append Bullets To Main Bullets Container
    bulletsSpanContainer.appendChild(bulletSpan);
  }
}

// 

function addQuestionData(obj, count){
  if (currentIndex < count ) {
    // Create H2 Question Title
    let questionTitle = document.createElement("h2");

  // Create Question Text
    let questionText = document.createTextNode(obj['title']);

  // Append Text To h2
    questionTitle.appendChild(questionText);

  // Append h2 to quiz Area
    quizArea.appendChild(questionTitle);

  // Create The Answers 
    for(let i = 1; i <= 4; i++){
    // Create Main Answer Div
      let mainDiv = document.createElement("div");
    
    // Add Class To Main Div
      mainDiv.className = "answer";

    //Create Radio Input
      let radioInput = document.createElement("input");

    // Add Type + Name + id + data-attr
      radioInput.name = 'question';
      radioInput.type = 'radio';
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

    // Make First Option Checked
      if (i === 1){
        radioInput.checked = true
      }
    // Create Label
      let theLable = document.createElement("label");

    // Add For Attr
      theLable.htmlFor = `answer_${i}`;

    //Create Label Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`])

    // Add The Text To Text
      theLable.appendChild(theLabelText);

    // Add Input + lable To Main div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLable);

    // Append All Div to answer Area
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count){
  let answers = document.getElementsByName("question");
  let theChosenAnswer;

  for(let i = 0; i < answers.length; i++){
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets(){
  let bulletsSpan = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpan)
  arrayOfSpans.forEach((span,index) => {
    if(currentIndex === index) {
      span.className = "on";
    }
  })
}

function showResults(count){
  let theResults;
  if(currentIndex === count){
    quizArea.remove();
    answersArea.remove();
    submitBtn.remove();
    bullets.remove();
    
    if (rightAnswers > (count/2) && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count} Is Good`;
    } else if (rightAnswers === count){
          theResults = `<span class="perfect">Perfect</span>, All Answers Are Correct`;
    } else {
    theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count} Is Bad.`;
    }
    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = '10px';
    resultsContainer.style.backgroundColor = 'white';
    resultsContainer.style.marginTop = '10px';
  }
}

function contdown(duration, count){
  if(currentIndex < count){
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;
      if(--duration < 0){
        clearInterval(countdownInterval);
        submitBtn.click();
        
      }
    }, 1000);
  }
}