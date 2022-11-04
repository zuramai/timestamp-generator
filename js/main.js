const dropzone = document.getElementById('dropzone')
const dropzoneInput = document.querySelector('.dropzone-input')
const isMultiple = dropzoneInput.getAttribute('multiple');

const files = []

['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function(event) {
    dropzone.addEventListener(event, e => {
        e.preventDefault();
        e.stopPropagation();
    });
});

dropzone.addEventListener('dragover', function(e) {
    this.classList.add('dropzone-dragging');
}, false);
  dropzone.addEventListener('dragleave', function(e) {
    this.classList.remove('dropzone-dragging');
}, false);
  
dropzone.addEventListener('drop', function(e) {
    this.classList.remove('dropzone-dragging');
    var files = e.dataTransfer.files;
    var dataTransfer = new DataTransfer();
    
    files.forEach(file => {
        console.log(file)
    })
  
    var filesToBeAdded = dataTransfer.files;
    dropzoneInput.files = filesToBeAdded;
    alert(for_alert);
    
}, false);
  
dropzone.addEventListener('click', function(e) {
    dropzoneInput.click();
});
  