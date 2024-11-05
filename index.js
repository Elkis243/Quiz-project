import { Questions } from "./questions.js";

const appQuiz = document.querySelector('#appQuiz')
const startQuizButton = document.querySelector('#startQuizButton')

startQuizButton.addEventListener('click', startQuiz)

function startQuiz() {
    let currentQuestion =  0
    let score = 0
    let interval

    displayQuestion(currentQuestion)

    function displayQuestion(index) {
        const question = Questions[index]
        clearInterval(interval)

        while (appQuiz.firstElementChild) {
            appQuiz.firstElementChild.remove()
        }

        if (!question) {
            displayFinishMessage()
            return 
        }

        displayTimeLimit()
        displayProgess(Questions.length, currentQuestion)
        displayTitle(question.index, question.title)
        displayAnswers(question.answers)


        const submitButton = displaySubmitButton()
        appQuiz.appendChild(submitButton)
        

        document.querySelectorAll('input[name="answer"]').forEach(item => {
            item.addEventListener('change', () => {
                submitButton.classList.remove('disabled')*
                submitButton.addEventListener('click', submit)
            })
        })

    }


    function displayFinishMessage() {
        const finishMessage = document.createElement('h4')
        finishMessage.innerText = 'Quiz terminé. Merci de participer !'

        const scoreMessage = document.createElement('p')
        scoreMessage.innerText = `Votre score est de : ${score} sur ${Questions.length} points`

        const restartQuiz = document.createElement('button')
        restartQuiz.innerText = 'Recommencer'
        restartQuiz.classList.add('btn', 'btn-primary', 'me-2')

        const exitQuiz = document.createElement('button')
        exitQuiz.innerText = 'Home page'
        exitQuiz.classList.add('btn', 'btn-primary')
        
        
        appQuiz.appendChild(finishMessage)
        appQuiz.appendChild(scoreMessage)
        appQuiz.appendChild(restartQuiz)
        appQuiz.appendChild(exitQuiz)

        restartQuiz.addEventListener('click', () =>{
            currentQuestion = 0
            console.log(currentQuestion)
            displayQuestion(currentQuestion)
        })

        exitQuiz.addEventListener('click', () =>{
            location.reload()
        })
    }

    function displayTimeLimit() {
        let timeout = 30000

        const containerTimeLimitQuestionElement = document.createElement('div')
        containerTimeLimitQuestionElement.classList.add('d-flex', 'flex-row-reverse')

        const timeLimitElement = document.createElement('span')
        timeLimitElement.classList.add('p-2', 'text-white', 'mb-3', 'bg-primary', 'rounded-1')

        timeLimitElement.innerText = `Temps : ${timeout/1000}s`
        containerTimeLimitQuestionElement.appendChild(timeLimitElement)

        interval = setInterval(() => {
            timeout-=1000
            if (timeout <= 0) {
                clearInterval(interval)
                currentQuestion++
                displayQuestion(currentQuestion)
            }
            timeLimitElement.innerText = `Temps : ${timeout/1000}s`
        }, 1000)

        appQuiz.appendChild(containerTimeLimitQuestionElement)
    }

    function displayProgess(max, value) {
        const progessElement = document.createElement('progress')
        progessElement.classList.add('w-100')
        progessElement.setAttribute('max', max)
        progessElement.setAttribute('value', value)

        appQuiz.appendChild(progessElement)
    }

    function displayTitle(index, title) {
        const titleElement = document.createElement('p')
        titleElement.classList.add('mt-3', 'mb-3', 'question')
        titleElement.innerText = `${index}. ${title}`
        appQuiz.appendChild(titleElement)
    }

    function displayAnswers(answers) {
        const containerQuestionElement = document.createElement('div')
        containerQuestionElement.classList.add('d-flex', 'flex-column')

        for (const item of answers) {
            const assertion = createAssertion(item)
            containerQuestionElement.appendChild(assertion)
        }

        appQuiz.appendChild(containerQuestionElement)
    }

    function submit() {
        const selectedAnswer = appQuiz.querySelector('input[name="answer"]:checked')
        
        dissableAllAnswers()

        const question = Questions[currentQuestion]    
        const value = selectedAnswer.value
        const isCorrect = value === question.correctAnswer

        if (isCorrect) {
            score++
        }
        currentQuestion++

        displayFeeback(isCorrect, question.correctAnswer, value)

        setTimeout(() => {
            displayQuestion(currentQuestion)
        }, 500);
    }

    function displayFeeback(isCorrect, correctAnswer, value) {
        const correctAnswerId = formatId(correctAnswer)
        const getCorrectAnswerElement = document.querySelector(`label[for="${correctAnswerId}"]`)
        
        const selectedAnswerId = formatId(value)
        const getSelectedAnswerElement = document.querySelector(`label[for="${selectedAnswerId}"]`)

        if (isCorrect) {
            getSelectedAnswerElement.classList.add('alert', 'alert-success')
        } else{
            getCorrectAnswerElement.classList.add('alert', 'alert-success')
            getSelectedAnswerElement.classList.add('alert', 'alert-danger')
        }
    }
}

function formatId(text) {
    return  text.replaceAll(' ', '_').toLowerCase()
}

function createAssertion(item) {
    const id = formatId(item)

    const labelElement = document.createElement('label')
    labelElement.classList.add('p-3', 'border', 'border-2', 'm-2', 'cursor-pointer')
    labelElement.innerText = item
    labelElement.htmlFor = id

    const inputRadioElement = document.createElement('input')
    inputRadioElement.classList.add('float-end')
    inputRadioElement.setAttribute('type', 'radio')
    inputRadioElement.setAttribute('value', item)
    inputRadioElement.setAttribute('name', 'answer')
    inputRadioElement.id = id

    labelElement.appendChild(inputRadioElement)

    return labelElement

}

function displaySubmitButton() {
    const submitButtonElement = document.createElement('button')
    submitButtonElement.innerText = 'Soumettre'
    submitButtonElement.classList.add('btn', 'btn-primary', 'w-100', 'mt-3')
    
    return submitButtonElement
}

function dissableAllAnswers() {
    const radioInputs = document.querySelectorAll('input[type="radio"]')
    for (const radioInput of radioInputs) {
        radioInput.disabled = true
    }
}