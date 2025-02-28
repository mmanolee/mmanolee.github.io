const content = [
  {
    image: "media/img/header/header_1.jpg",
    title: "Chi siamo?",
    text: "Siamo un'associazione dedicata alla protezione e alla conservazione dei koala. Il nostro impegno è volto a garantire un futuro sicuro per questi meravigliosi animali, aiutando a preservare il loro habitat naturale e promuovendo l'educazione ecologica nella comunità."
  },
  {
    image: "media/img/header/header_2.jpg",
    title: "La nostra missione",
    text: "La nostra missione è proteggere i koala e i loro habitat. Lavoriamo a stretto contatto con altri enti e volontari per garantire che questi animali abbiano un ambiente sicuro dove possano prosperare, lontano dalle minacce che li mettono a rischio di estinzione."
  },
  {
    image: "media/img/header/header_3.jpg",
    title: "Salava un Koala noi!",
    text: "Adottare un koala tramite la nostra associazione è un modo meraviglioso per fare la differenza. Con il tuo contributo, possiamo offrire ai koala un ambiente sicuro e protetto, aiutandoli a crescere e prosperare. Ogni adozione a distanza ti permetterà di seguire il viaggio del tuo koala e di contribuire concretamente alla sua salvaguardia."
  }
];

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");

  menuToggle.addEventListener("click", function () {
    nav.classList.toggle("active");
  });
});

let currentIndex = 0; // Tracks the current image index

// Get references to the elements
const imageElement = document.getElementById("image");
const titleElement = document.getElementById("title");
const textElement = document.getElementById("text");
const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");

// Function to update the content with fade effect
function updateContent(index) {
  // Fade out the current image
  imageElement.classList.add("fade-out");

  // Wait for the fade-out to complete
  setTimeout(() => {
    // Update the image, title, and text
    imageElement.src = content[index].image;
    titleElement.textContent = content[index].title;
    textElement.textContent = content[index].text;

    // Fade in the new image
    imageElement.classList.remove("fade-out");
  }, 500); // Match the duration of the CSS transition (0.5s)
}

// Left arrow click event
leftArrow.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + content.length) % content.length; // Loop back to the last image if at the first
  updateContent(currentIndex);
});

// Right arrow click event
rightArrow.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % content.length; // Loop back to the first image if at the last
  updateContent(currentIndex);
});


document.querySelectorAll('.koala-item').forEach((item) => {
  item.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevents the click from bubbling up to the document
    console.log(item.classList)
    item.classList.toggle('active'); // Toggle the 'active' class
    console.log(item.classList)
  });
});

// Initialize with the first content
content.forEach((item) => {
  const img = new Image();
  img.src = item.image;
});
updateContent(currentIndex);


// QR
// Get DOM elements
const scanButton = document.getElementById('scan-qr-button');
const scannerContainer = document.getElementById('scanner-container');
const webcam = document.getElementById('webcam');
const ticketList = document.getElementById('tickets');
const congratsMessage = document.getElementById('congrats-message');
const unlockedLink = document.getElementById('unlocked-link');

// List to store scanned tickets
const scannedTickets = [];

// Variable to track if the webcam is active
let isWebcamActive = false;
let stream = null;

// Function to start the webcam and scan QR codes
function startScanner() {
  // Show the scanner container
  scannerContainer.classList.remove('hidden');

  // Access the webcam
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then((mediaStream) => {
      stream = mediaStream;
      webcam.srcObject = stream;
      webcam.play();
      isWebcamActive = true;
      scanButton.textContent = 'Stop Scanning'; // Update button text
      requestAnimationFrame(scanQRCode);
    })
    .catch((err) => {
      console.error('Errore con la Camera:', err);
      alert('Non è possibile accedere alla camera selezionata');
    });
}

// Function to stop the webcam
function stopScanner() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop()); // Stop all tracks
    webcam.srcObject = null; // Clear the webcam feed
    isWebcamActive = false;
    scanButton.textContent = 'Scannerizza il tuo codice QR!'; // Update button text
  }
}

function scanQRCode() {
  if (isWebcamActive && webcam.readyState === webcam.HAVE_ENOUGH_DATA) {
    const canvas = document.createElement('canvas');
    canvas.width = webcam.videoWidth;
    canvas.height = webcam.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {

      if (code.data == "biglietto_1_regaloNatale2025")
        ticket = "Buono per un campeggio";
      else if (code.data == "biglietto_2_regaloNatale2025")
        ticket = "Buono per una cena elegante";
      else //(code.data == "biglietto_0_regaloNatale2024")
        ticket = "Buono per un party";
      
      if (!scannedTickets.includes(ticket)) {
        scannedTickets.push(ticket); 
        updateTicketList(); 
        
        if (scannedTickets.length === 3) {
          congratsMessage.classList.remove('hidden');
          unlockedLink.href = "https://www.desmos.com/calculator/8583ualmsi"
        }
      }
    }
  }

  if (isWebcamActive) {
    requestAnimationFrame(scanQRCode);
  }
}


function updateTicketList() {
  ticketList.innerHTML = scannedTickets
    .map((ticket) => {
      // Check if the ticket contains the word "party"
      if (ticket.includes("party")) {
        // Map the ticket to its corresponding PDF file
        const pdfFile = 'media/pdf/party.pdf'; // Assuming the PDF for "party" is always 'party.pdf'
        return `<li onclick="downloadPDF('${pdfFile}')">${ticket}</li>`;
      } else {
        // For other tickets, just display them as plain text
        return `<li>${ticket}</li>`;
      }
    })
    .join('');
}

// Event listener for the scan button
scanButton.addEventListener('click', () => {
  if (isWebcamActive) {
    stopScanner(); // Stop the webcam if it's active
  } else {
    startScanner(); // Start the webcam if it's inactive
  }
});

// Ottieni riferimenti agli elementi
const donateButton = document.getElementById('donate-button');
const twintInfo = document.getElementById('twint-info');

// Aggiungi un event listener al bottone
donateButton.addEventListener('click', () => {
  twintInfo.classList.toggle('hidden'); // Mostra/nasconde il testo
});

function downloadPDF(ticket) {
  let pdfFile = "media/pdf/per_nikiiii.pdf";

  const link = document.createElement('a');
  link.href = pdfFile;
  link.download = pdfFile;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

