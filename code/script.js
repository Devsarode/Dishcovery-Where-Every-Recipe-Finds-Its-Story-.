// ==========================
// Dishcovery JS Functionality
// ==========================

// --------------------------
// Highlight Active Nav Link
// --------------------------
const navLinks = document.querySelectorAll('.bottom-nav a');
navLinks.forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add('active');
  }
});

// --------------------------
// Like & Save Button Toggle (Cards & Modal)
// --------------------------
const actionButtons = document.querySelectorAll('.actions button');

actionButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.innerText.includes('Like')) {
      btn.classList.toggle('liked');
      btn.innerHTML = btn.classList.contains('liked') 
        ? '<i class="fa-solid fa-thumbs-up"></i> Liked'
        : '<i class="fa-solid fa-thumbs-up"></i> Like';
    } else if (btn.innerText.includes('Save')) {
      btn.classList.toggle('saved');
      btn.innerHTML = btn.classList.contains('saved') 
        ? '<i class="fa-solid fa-bookmark"></i> Saved'
        : '<i class="fa-solid fa-bookmark"></i> Save';
    }
  });
});

// --------------------------
// Friend Chat Simulation
// --------------------------
const chatButtons = document.querySelectorAll('.friend-list button');

chatButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    alert('Opening chat with ' + btn.parentElement.textContent.replace('Chat','').trim());
  });
});

// --------------------------
// Upload Thumbnail Preview
// --------------------------
const thumbnailInput = document.querySelector('#thumbnail');
if(thumbnailInput){
  const previewDiv = document.createElement('div');
  previewDiv.style.marginTop = '10px';
  previewDiv.style.textAlign = 'center';
  thumbnailInput.parentNode.insertBefore(previewDiv, thumbnailInput.nextSibling);

  thumbnailInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = function(ev){
        previewDiv.innerHTML = `<img src="${ev.target.result}" alt="Thumbnail Preview" style="width:200px;border-radius:8px;margin-top:10px;">`;
      }
      reader.readAsDataURL(file);
    } else {
      previewDiv.innerHTML = '';
    }
  });
}

// --------------------------
// Search Recipes on Home
// --------------------------
const searchInput = document.querySelector('header input[type="text"]');
if(searchInput){
  searchInput.addEventListener('keyup', () => {
    const query = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll('.card h3');
    cards.forEach(title => {
      if(title.textContent.toLowerCase().includes(query)){
        title.parentElement.parentElement.style.display = 'block';
      } else {
        title.parentElement.parentElement.style.display = 'none';
      }
    });
  });
}

// ==========================
// Video Modal Functionality
// ==========================
const modal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const closeModal = document.querySelector('.modal .close');

const likeBtn = document.getElementById('likeVideo');
const saveBtn = document.getElementById('saveVideo');

const commentInput = document.getElementById('commentInput');
const postComment = document.getElementById('postComment');
const commentList = document.getElementById('commentList');

// Open video modal on card click
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    const videoSrc = card.dataset.video;
    modalVideo.src = videoSrc; // load video
    modal.style.display = 'flex';
    commentList.innerHTML = ''; // clear previous comments
    likeBtn.classList.remove('liked');
    likeBtn.innerHTML = '<i class="fa-solid fa-thumbs-up"></i> Like';
    saveBtn.classList.remove('saved');
    saveBtn.innerHTML = '<i class="fa-solid fa-bookmark"></i> Save';
  });
});

// Close modal
closeModal.addEventListener('click', () => {
  modalVideo.pause();
  modal.style.display = 'none';
  modalVideo.src = '';
});

// Like / Save buttons inside modal
likeBtn.addEventListener('click', () => {
  likeBtn.classList.toggle('liked');
  likeBtn.innerHTML = likeBtn.classList.contains('liked') ? 
    '<i class="fa-solid fa-thumbs-up"></i> Liked' : 
    '<i class="fa-solid fa-thumbs-up"></i> Like';
});

saveBtn.addEventListener('click', () => {
  saveBtn.classList.toggle('saved');
  saveBtn.innerHTML = saveBtn.classList.contains('saved') ? 
    '<i class="fa-solid fa-bookmark"></i> Saved' : 
    '<i class="fa-solid fa-bookmark"></i> Save';
});

// Post comments inside modal
postComment.addEventListener('click', () => {
  if(commentInput.value.trim() !== ''){
    const li = document.createElement('li');
    li.textContent = commentInput.value;
    commentList.appendChild(li);
    commentInput.value = '';
  }
});

// Close modal on clicking outside
window.addEventListener('click', (e) => {
  if(e.target === modal){
    modalVideo.pause();
    modal.style.display = 'none';
    modalVideo.src = '';
  }
});
