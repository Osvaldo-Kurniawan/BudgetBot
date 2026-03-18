/**
 * QR Code Generator Utility
 * Generate QR codes as images (PNG) for easier scanning
 */

const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

// Create qr directory if not exists
const QR_DIR = path.join(__dirname, "..", "..", "qr");

const ensureQRDir = () => {
  if (!fs.existsSync(QR_DIR)) {
    fs.mkdirSync(QR_DIR, { recursive: true });
  }
};

/**
 * Generate QR code as PNG image
 * @param {string} data - QR data/content
 * @param {string} filename - Output filename (without .png)
 * @returns {Promise<string>} Path to PNG file
 */
const generateQRImage = async (data, filename = "qr") => {
  try {
    ensureQRDir();
    
    const filePath = path.join(QR_DIR, `${filename}.png`);
    
    // Generate QR as PNG file
    await QRCode.toFile(filePath, data, {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 0.95,
      margin: 1,
      width: 300,
    });
    
    return filePath;
  } catch (error) {
    console.error("❌ Error generating QR image:", error);
    throw error;
  }
};

/**
 * Generate QR as Data URL (Base64)
 * @param {string} data - QR data/content
 * @returns {Promise<string>} Data URL
 */
const generateQRDataURL = async (data) => {
  try {
    const dataUrl = await QRCode.toDataURL(data, {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 0.95,
      margin: 1,
      width: 300,
    });
    return dataUrl;
  } catch (error) {
    console.error("❌ Error generating QR data URL:", error);
    throw error;
  }
};

module.exports = {
  generateQRImage,
  generateQRDataURL,
};
