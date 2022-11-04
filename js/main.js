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
    showImages()
}, false);
  
const showLoading = () => {
    const loader = document.querySelector('.loader-wrapper')
    loader.classList.add('show')
    console.log('show loadint')
    setTimeout(() => {
        loader.classList.remove('show')        
    }, 3000)
}

const countDaysBetween = (date1, date2) => {
    let difference = new Date(date2).getTime() - new Date(date1).getTime()
    let totalDays = Math.ceil(difference / (1000 * 3600 * 24))
    return totalDays
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

    files.forEach(async file => {
        const imageUrl = URL.createObjectURL(file)
        const image = new Image()
        image.src = imageUrl

        // Process the image
        await draw(image, currentDayToPrint.toLocaleDateString(), "Binus University Anggrek Campus, Jakarta Barat")
        download(currentDayToPrint.toLocaleDateString())
        currentDayToPrint.setDate(currentDayToPrint.getDate()+1)
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
    let fontBase = 1000, fontSize = 30;                    
    let ratio = fontSize / fontBase;  
    let size = canvas.width * ratio;   
    return (size|0) 
}

const draw = async (image, date, place) => {
    return new Promise((resolve) => {
        // set canvas size to image size
        image.onload = () => {
            console.log('iage loageded', image)
    
            canvas.setAttribute('width', image.width) 
            canvas.setAttribute('height', image.height) 
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
            // Draw text
            const fontSize = getFontSize()
            ctx.fillStyle = "white"
            ctx.font = `${fontSize}px 'Noto Sans'`
            ctx.textBaseline = "top"
            ctx.fillText(date, 20, 20)
            ctx.fillText(place, 20, 20 + fontSize + 30)
            resolve()
        }
    })
}
const download = (number) => {
    console.log('downloading', number)
    var link = document.createElement('a');
    link.download = `photo-${number}.png`;
    link.href = canvas.toDataURL()
    link.click();
}