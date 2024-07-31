class Task {
    constructor(name, email, date, hour){
        this.name = name
        this.email = email
        this.date = date
        this.hour = hour
    }

    validateData(){
        for (let i in this){
            if(this[i] === undefined || this[i] === ""){
                return false
            }
        }
        return true
    }

    validateDateTime() {
        const currentDate = new Date();
        const scheduledDate = new Date(`${this.date}T${this.hour}`);

        return scheduledDate >= currentDate;
    }
}

function getNextId() {
    const nextId = localStorage.getItem('id')
    return parseInt(nextId) + 1;
}


class Database {
    constructor(){
        const id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    loadSchedules() {
        const schedules = Array()
        
        const id = localStorage.getItem('id')

        for(let i = 1; i <= id; i++){
            const schedule = JSON.parse(localStorage.getItem(i))

            if(schedule === null){
                continue
            }

            schedule.id = i
            schedules.push(schedule)
        }
        return schedules
    }

    createSchedule (schedule){
        const id = getNextId();
        localStorage.setItem(id, JSON.stringify(schedule))
        localStorage.setItem('id', id)
    }

    checkDuplicate(schedule) {
        const schedules = this.loadSchedules();
        return schedules.some(existingSchedule =>
            existingSchedule.email === schedule.email &&
            existingSchedule.date === schedule.date &&
            existingSchedule.hour === schedule.hour
        );
    }

    removeSchedule(id) {
        localStorage.removeItem(id)
    }
}

const database = new Database()

function registerSchedule() {
    event.preventDefault();

    const name = document.getElementById('nome').value
    const email = document.getElementById('email').value
    const data = document.getElementById('data').value
    const hour = document.getElementById('hora').value

    const scheduled = new Task(name, email, data, hour)

    if(scheduled.validateData()){
        if(scheduled.validateDateTime()){
            if(!database.checkDuplicate(scheduled)){
                database.createSchedule(scheduled)
            alert("Horário agendado com sucesso!")
            }else{
                alert("Já existe um agendamento para este horário com este email.")
            }            
        }else{
            alert('Não é possível agendar um horário anterior ao atual!')
        }        
    }
}

function renderSchedules(schedules){
    if(schedules === undefined){
        schedules = database.loadSchedules()
    }

    const listSchedules = document.getElementById('listSchedules')
    listSchedules.innerHTML = '';

    schedules.forEach((scd) => {
        const row  = listSchedules.insertRow()

        row.insertCell(0).innerHTML = scd.name
        row.insertCell(1).innerHTML = `${scd.day}/${scd.month}/${year}`

    })
}

/*Lógica para troca de abas */

document.addEventListener('DOMContentLoaded', () => {
    const checkScheduleBtn = document.getElementById('check-schedule-btn');
    const backScheduleBtn = document.getElementById('back-schedule-btn');
    const scheduleSection = document.getElementById('schedule-section');
    const checkScheduleSection = document.getElementById('check-schedule-section');
    const tabContent = document.getElementById('tab-content');

    checkScheduleBtn.addEventListener('click', () => {
        fetch('schedule_content.html')
            .then(response => response.text())
            .then(data => {
                tabContent.innerHTML = data;
                scheduleSection.classList.add('hidden');
                checkScheduleSection.classList.remove('hidden');
                checkScheduleBtn.classList.add('hidden');
                backScheduleBtn.classList.remove('hidden');
            })
            .catch(error => {
                tabContent.innerHTML = 'Error loading content';
                console.error('Error:', error);
            });
    });

    backScheduleBtn.addEventListener('click', () => {
        scheduleSection.classList.remove('hidden');
        checkScheduleSection.classList.add('hidden');
        checkScheduleBtn.classList.remove('hidden');
        backScheduleBtn.classList.add('hidden');
    });
});

function registerSchedule(event) {
    event.preventDefault();
    // Lógica para registrar o agendamento
    alert('Agendamento registrado!');
}