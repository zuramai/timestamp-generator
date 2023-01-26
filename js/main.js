const dropzone = document.getElementById('dropzone')
const dropzoneInput = document.querySelector('.dropzone-input')
const isMultiple = dropzoneInput.getAttribute('multiple')

const btnGenerate = document.getElementById('generate')
const btnDownload = document.querySelector('download')

const p = dropzone.querySelector('p')

let files = [];

['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function(event) {
    dropzone.addEventListener(event, e => {
        e.preventDefault();
        e.stopPropagation();
    });
});

const showImages = () => {
    const imagesWrapper = document.querySelector('.images')
    p.classList.remove('show')

    files.forEach(file => {
        const imageUrl = URL.createObjectURL(file)
        const imageDiv = document.createElement('div')
        imageDiv.classList.add('image')
        const img = document.createElement('img')
        img.src = imageUrl
        
        imageDiv.append(img)
        imagesWrapper.append(imageDiv)
    })
}
dropzone.addEventListener('dragover', function(e) {
    this.classList.add('dropzone-dragging');
}, false);
dropzone.addEventListener('dragleave', function(e) {
    this.classList.remove('dropzone-dragging');
}, false);
dropzone.addEventListener('drop', function(e) {
    this.classList.remove('dropzone-dragging');
    var fileList = e.dataTransfer.files;
    var dataTransfer = new DataTransfer();

    files = Array.from(fileList)
    dropzoneInput.files = dataTransfer.files;
    btnGenerate.classList.add('show')
    showImages()
}, false);
  
const showLoading = () => {
    const loader = document.querySelector('.loader-wrapper')
    loader.classList.add('show')
    console.log('show loadint')
    setTimeout(() => {
        loader.classList.remove('show')        
    }, 1000)
}

const countDaysBetween = (date1, date2) => {
    let difference = new Date(date2).getTime() - new Date(date1).getTime()
    let totalDays = Math.ceil(difference / (1000 * 3600 * 24))
    return totalDays
}

const randomTime = () => {
    return {
        hour: Math.floor(Math.random() * 14) + 8, // between 8 - 14
        minute:  Math.floor(Math.random() * 59) 
    } 
}

const generate = async () => {
    // Get the starting and ending date 
    let now = new Date
    let startDate = document.getElementById('start').value || Date.now()
    let endDate = document.getElementById('end').value || now.setDate(now.getDate() + 1)
    let position = document.getElementById('position').value

    let daysCount = countDaysBetween(startDate, endDate)
    console.log(daysCount)

    let currentDayToPrint = new Date(startDate)

    files.forEach(async (file, i) => {
        const imageUrl = URL.createObjectURL(file)
        const image = new Image()
        image.src = imageUrl

        currentDayToPrint.setHours(randomTime().hour)
        currentDayToPrint.setMinutes(randomTime().minute)

        // Process the image
        currentDayToPrint.setDate(currentDayToPrint.getDate() + ((i === 0) ? 0 : 1))
        const dateString = currentDayToPrint.toLocaleString();

        draw(image, dateString, "Binus University Anggrek Campus, Jakarta Barat")
        .then(() => {
                console.log('printing', dateString)
                download(dateString)
            })
    })
}
btnGenerate.addEventListener('click', e => {
    // validate
    if(!files.length) return alert('Please choose file first') 
    e.preventDefault()
    showLoading()
    generate()
})



const canvas = document.getElementById('canvas')
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')



function getFontSize() {
    let fontBase = 1000, fontSize = 40;                    
    let ratio = fontSize / fontBase;  
    let size = canvas.width * ratio;   
    return (size|0) 
}

const strokeAndFill = (text, x, y) => {
    ctx.fillText(text, x, y)
    ctx.strokeText(text, x, y)
}

const draw = async (image, date, place) => {
    return new Promise((resolve) => {
        // set canvas size to image size
        image.onload = () => {

            const sizeX = image.width/3
            const sizeY = image.height/3
    
            canvas.setAttribute('width', sizeX) 
            canvas.setAttribute('height', sizeY) 
            ctx.drawImage(image, 0, 0, sizeX, sizeY)

            // Draw text
            const fontSize = getFontSize()
            ctx.fillStyle = "white"
            ctx.font = `${fontSize}px 'Noto Sans'`
            ctx.textBaseline = "top"
            ctx.strokeStyle = "black"
            ctx.lineWidth = 2
            strokeAndFill(date, 20, 20)
            strokeAndFill(place, 20, 20 + fontSize + 30)
            resolve()
        }
    })
}

/**
 * Download the image from canvas
 * @param {number} number The order of the image, that will be put in the end of the name of output image
 */
const download = (number) => {
    console.log('downloading', number)
    var link = document.createElement('a');
    link.download = `photo-${number}.png`;
    link.href = canvas.toDataURL()
    link.click();
}