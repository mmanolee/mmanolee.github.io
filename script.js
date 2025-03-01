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

let currentIndex = 0;

const imageElement = document.getElementById("image");
const titleElement = document.getElementById("title");
const textElement = document.getElementById("text");
const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");

function updateContent(index) {
  imageElement.classList.add("fade-out");

  setTimeout(() => {
    imageElement.src = content[index].image;
    titleElement.textContent = content[index].title;
    textElement.textContent = content[index].text;

    imageElement.classList.remove("fade-out");
  }, 500); 
}

leftArrow.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + content.length) % content.length; 
  updateContent(currentIndex);
});

rightArrow.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % content.length; 
  updateContent(currentIndex);
});


document.querySelectorAll('.koala-item').forEach((item) => {
  item.addEventListener('click', (event) => {
    event.stopPropagation(); 
    console.log(item.classList)
    item.classList.toggle('active'); 
    console.log(item.classList)
  });
});

content.forEach((item) => {
  const img = new Image();
  img.src = item.image;
});
updateContent(currentIndex);



const scanButton = document.getElementById('scan-qr-button');
const scannerContainer = document.getElementById('scanner-container');
const webcam = document.getElementById('webcam');
const ticketList = document.getElementById('tickets');
const congratsMessage = document.getElementById('congrats-message');
const unlockedLink = document.getElementById('unlocked-link');

const scannedTickets = [];

let isWebcamActive = false;
let stream = null;

function startScanner() {
  scannerContainer.classList.remove('hidden');

  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then((mediaStream) => {
      stream = mediaStream;
      webcam.srcObject = stream;
      webcam.play();
      isWebcamActive = true;
      scanButton.textContent = 'Stop Scanning'; 
      requestAnimationFrame(scanQRCode);
    })
    .catch((err) => {
      console.error('Errore con la Camera:', err);
      alert('Non è possibile accedere alla camera selezionata');
    });
}

function stopScanner() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop()); 
    webcam.srcObject = null;
    isWebcamActive = false;
    scanButton.textContent = 'Scannerizza il tuo codice QR!'; 
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
      if (ticket.includes("party")) {
        
        const pdfFile = 'media/pdf/party.pdf';
        return `<li onclick="downloadPDF('${pdfFile}')">${ticket} (cliccami per ricevere i biglietti)</li>`;
      } else {
        return `<li>${ticket}</li>`;
      }
    })
    .join('');
}

scanButton.addEventListener('click', () => {
  if (isWebcamActive) {
    stopScanner(); 
  } else {
    startScanner(); 
  }
});

const uploadButton = document.getElementById('upload-qr-button');
const qrImageInput = document.getElementById('qr-image-input');

uploadButton.addEventListener('click', () => {
  qrImageInput.click(); 
});

qrImageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.src = e.target.result;
      image.onload = () => {
        scanQRFromImage(image); 
      };
    };
    reader.readAsDataURL(file); 
  }
});

function scanQRFromImage(image) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height);

  if (code) {
    let ticket;
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
        unlockedLink.href = "https://www.desmos.com/calculator/8583ualmsi";
      }
    }
  } else {
    alert('Nessun codice QR trovato nell\'immagine.');
  }
}


const donateButton = document.getElementById('donate-button');
const twintInfo = document.getElementById('twint-info');

donateButton.addEventListener('click', () => {
  twintInfo.classList.toggle('hidden'); 
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

