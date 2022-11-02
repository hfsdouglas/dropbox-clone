class DropboxController {

    constructor() {

        this.btnSendFileEl = document.querySelector("#btn-send-file")
        this.inputFileEl = document.querySelector("#files")
        this.snackModalEl = document.querySelector("#react-snackbar-root")
        this.progressBarEl = document.querySelector(".mc-progress-bar-fg")
        this.nameFileEl = document.querySelector(".filename")
        this.timeLeft = document.querySelector(".timeleft")
        this.startUploadTime = null
        this.initEvents()

    }

    initEvents() {

        this.btnSendFileEl.addEventListener('click', event => {
            this.inputFileEl.click()
        })
        this.inputFileEl.addEventListener('change', event => {
            this.uploadTask(event.target.files)
            this.modalShow()
            this.inputFileEl.value = ''
            
        })

    }

    modalShow(show = true){
        this.snackModalEl.style.display = (show) ? 'block' : 'none'
    }

    uploadTask(files) {

        let promises = [];
        [...files].forEach(file => {
            promises.push(new Promise((resolve, reject) => {
                let ajax = new XMLHttpRequest()
                ajax.open('POST', '/upload')
                ajax.onload = event => {
                    this.modalShow(false)
                    try {
                        resolve(JSON.parse(ajax.responseText))
                    } catch(e) {
                        reject(e)
                    }

                }
                ajax.upload.onprogress = event => {
                    this.uploadProgress(event, file)
                }
                ajax.onerror = event => {
                    reject(event)
                    this.modalShow(false)
                }
                let formData = new FormData()
                formData.append('input-file', file)
                this.startUploadTime = Date.now()
                ajax.send(formData)
            }))
        })
        return Promise.all (promises)
    }

    uploadProgress(event, file) {
        let timeSpent = Date.now() - this.startUploadTime
        let loaded = event.loaded
        let total = event.total
        let percent = parseInt((loaded / total) * 100)
        let finalTime = ((100 - percent) * timeSpent) / percent

        this.progressBarEl.style.width = `${percent}%` 

        this.nameFileEl.innerHTML = file.name
        this.timeLeft.innerHTML = this.formatTimeToHuman(finalTime)
        //console.log(timeSpent, finalTime, percent)
    } 

    formatTimeToHuman(duration) {
        let seconds = parseInt((duration / 1000) % 60)
        let minutes = parseInt((duration / (1000 * 60)) % 60)
        let hours = parseInt((duration / (1000 * (60 * 60))) % 24)

        console.log(seconds, minutes, hours)

        if(hours > 0) {
            return `${hours} horas, ${minutes} minutos e ${seconds} segundos`
        }

        if(minutes > 0) {
            return `${minutes} minutos e ${seconds} segundos`
        }

        if(seconds > 0) {
            return `${seconds} segundos`
        }

        return '0'
    }
}