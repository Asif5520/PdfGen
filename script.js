const input = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const generateBtn = document.getElementById("generateBtn");

let selectedImages = [];

input.addEventListener("change", (event) => {
  selectedImages = Array.from(event.target.files);
  preview.innerHTML = "";

  selectedImages.forEach((img) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageElement = document.createElement("img");
      imageElement.src = e.target.result;
      preview.appendChild(imageElement);
    };
    reader.readAsDataURL(img);
  });

  generateBtn.disabled = selectedImages.length === 0;
});

generateBtn.addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: "pt", format: "a4" });

  for (let i = 0; i < selectedImages.length; i++) {
    const img = await loadImage(URL.createObjectURL(selectedImages[i]));
    const width = pdf.internal.pageSize.getWidth();
    const ratio = img.height / img.width;
    const height = width * ratio;

    if (i !== 0) pdf.addPage();

    pdf.addImage(img, "JPEG", 0, 0, width, height);
  }

  pdf.save("images.pdf");

  // Track Generate PDF click in Vercel Analytics
  if (window.vercelAnalytics) {
    window.vercelAnalytics.track('generate_pdf', { value: 1 });
  }
});

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });
}
