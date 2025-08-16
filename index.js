const addTask = document.getElementById('add-task')
const currentTime = document.getElementById('display-timer')
const addTaskInput = document.getElementById('add-task-input')
const timerApplication = document.getElementById('timer-appliction')

const inputTaskName = document.getElementById('task-name')
const inputTaskDesc = document.getElementById('task-desc')
const inputTaskMins = document.getElementById('task-mins')
const inputTaskBreaks = document.getElementById('task-breaks')

const saveTaskBtn = document.getElementById('save-task')
const startTaskBtn = document.getElementById('start-timer')

const radios = document.querySelectorAll('input[name="timer"]')

const brownBg = 'rgb(193, 83, 79)'
const brownBgOps = 'rgba(193, 83, 79, 0.877)'

const blueBg = 'rgb(79, 109, 193)'
const blueBgOps = 'rgba(79, 109, 193, 0.88)'

const cyanBg = 'rgb(79, 191, 193)'
const cyanBgOps = 'rgba(79, 191, 193, 0.5)'

const fiveMins = 10
const fifteenMins = 10

let isAddTaskClicked = false
let isRunning = false
let timerInterval = null

let tasks = {}
let taskCounter = 0
let selected = 'pomodoro'

let currentTaskIndex = 1
let currentSession = 0
let workDuration = 0
let breakCount = 0

let remainingTime = 0

document.body.style.transition = 'all 0.5s'
timerApplication.style.transition = 'all 0.5s'

radios.forEach(radio => {
  radio.addEventListener('change', () => {
    selected = document.querySelector('input[name="timer"]:checked').id
    console.log(selected)
    if (selected === 'short-break') {
        document.body.style.background = cyanBgOps
        timerApplication.style.background = cyanBg
    }else if (selected === 'long-break'){
        document.body.style.background = blueBgOps
        timerApplication.style.background = blueBg
    } else {
        document.body.style.background = brownBgOps
        timerApplication.style.background = brownBg
    }
  })
})

addTask.addEventListener('click', ()=>{
    isAddTaskClicked = !isAddTaskClicked
    if(isAddTaskClicked){
        addTaskInput.style.display = 'flex'
        document.body.style.background = 'rgba(193, 83, 79, 0.5)'
        timerApplication.style.background = 'rgba(193, 83, 79, 0.5)'
    }
    else{
        addTaskInput.style.display = 'none'
        document.body.style.background = brownBgOps
        timerApplication.style.background = brownBg
    }
})

saveTaskBtn.addEventListener('click', ()=>{
    if (
        inputTaskName.value.trim() === "" ||
        inputTaskDesc.value.trim() === "" ||
        inputTaskMins.value.trim() === "" ||
        inputTaskBreaks.value.trim() === ""
    ) {
        alert("⚠️ Please fill out all fields before saving the task.")
        return
    }

    taskCounter++

    tasks[taskCounter] = {
        name: inputTaskName.value,
        description: inputTaskDesc.value,
        minutes: inputTaskMins.value,
        breaks: inputTaskBreaks.value,
    }

    inputTaskName.value = ""
    inputTaskDesc.value = ""
    inputTaskMins.value = ""
    inputTaskBreaks.value = ""

    addTaskInput.style.display = 'none'
    document.body.style.background = 'rgba(193, 83, 79, 0.877)'
    timerApplication.style.background = 'rgb(193, 83, 79)'
    isAddTaskClicked = false

    console.log(tasks)
})

function formatTime(seconds){
    let min = Math.floor(seconds / 60)
    let s = seconds % 60
    return `${min.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function setRadio(id) {
  document.getElementById(id).checked = true;
  selected = id;
}

function startNextSession(){
    const task = tasks[currentTaskIndex]

    if(!task) {
        alert("No Task available")
        return
    }

    workDuration = Math.floor(task.minutes * 60 / task.breaks)

    if(selected === 'pomodoro') {
        currentSession++
        breakCount++

        runTimer(workDuration, ()=>{
            if (breakCount % 4 === 0) {
                setRadio('long-break')
                startNextSession()
            } else {
                setRadio('short-break')
                startNextSession()
            }
        })
    } else if (selected === 'short-break') {
        runTimer(fiveMins, ()=>{
            setRadio('pomodoro')
            startNextSession()
        })
    } else if (selected === 'long-break') {
        runTimer(fifteenMins, ()=>{
            setRadio('pomodoro')
            startNextSession()
        })
    }

}

function runTimer(duration, callback){
    remainingTime = duration
    currentTime.textContent = formatTime(remainingTime)

    clearInterval(timerInterval)

    timerInterval = setInterval(() => {
        if (remainingTime > 0) {
            remainingTime --
            currentTime.textContent = formatTime(remainingTime)
        } else {
            clearInterval(timerInterval)
            callback()
        }
    }, 1000)
}

startTaskBtn.addEventListener('click', ()=>{
    isRunning = !isRunning

    // if (isRunning) {
    //     startTaskBtn.textContent = 'PAUSE'
    //     if (!timerInterval) {
    //         setRadio('pomodoro')
    //         startNextSession()
    //     }
    // }
    if (isRunning) {
        startTaskBtn.textContent = 'PAUSE'
        if (!timerInterval) {
            if (remainingTime > 0) {
                runTimer(remainingTime, ()=> {
                    if (selected === 'pomodoro') {
                        if (breakCount % 4 === 0) {
                            setRadio('long-break')
                            startNextSession()
                        } else {
                            setRadio('short-break')
                            startNextSession()
                        }
                    } else if (selected === 'short-break') {
                        setRadio('pomodoro')
                        startNextSession()
                    } else if (selected === 'long-break') {
                        setRadio('pomodoro')
                        startNextSession()
                    }
                })
            } else {
                setRadio('pomodoro')
                startNextSession()
            }
        }
    } else {
        startTaskBtn.textContent = 'START'
        clearInterval(timerInterval)
        timerInterval = null
    }
})
