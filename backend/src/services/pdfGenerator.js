const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

/**
 * PDF Certificate Generator Service
 *
 * Production Notes:
 * - Replace with HSM digital signatures (Thales, Gemalto)
 * - Add holographic watermark for printed copies
 * - Store in secure DMS (AWS S3 with encryption)
 * - Integrate with blockchain for hash verification
 */

class PDFGenerator {
  /**
   * Generate Land Title Certificate PDF
   */
  async generateTitleCertificate(titleData, outputPath) {
    return new Promise(async (resolve, reject) => {
      try {
        // Create PDF document
        const doc = new PDFDocument({
          size: 'A4',
          margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
          }
        });

        // Pipe to file
        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        // Generate QR code
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify/${titleData.certificate_number}`;
        const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          width: 150
        });

        // Convert data URL to buffer
        const qrBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');

        // Header - Ghana Flag Colors
        doc.rect(0, 0, doc.page.width, 40)
           .fill('#CE1126'); // Red

        doc.rect(0, 40, doc.page.width, 40)
           .fill('#FCD116'); // Yellow

        doc.rect(0, 80, doc.page.width, 40)
           .fill('#006B3F'); // Green

        // Reset to black for text
        doc.fillColor('#000000');

        // Title
        doc.fontSize(24)
           .font('Helvetica-Bold')
           .text('REPUBLIC OF GHANA', 50, 140, { align: 'center' });

        doc.fontSize(20)
           .text('LANDS COMMISSION', 50, 170, { align: 'center' });

        doc.fontSize(18)
           .text('LAND TITLE CERTIFICATE', 50, 200, { align: 'center' });

        // Demo watermark
        doc.fontSize(60)
           .fillColor('#FF0000')
           .fillOpacity(0.1)
           .text('DEMO', 150, 350, {
             align: 'center',
             rotate: -45
           });

        doc.fillOpacity(1)
           .fillColor('#000000');

        // Certificate details
        let yPos = 250;

        doc.fontSize(12)
           .font('Helvetica-Bold')
           .text('Certificate Number:', 50, yPos);
        doc.font('Helvetica')
           .text(titleData.certificate_number, 200, yPos);

        yPos += 30;
        doc.font('Helvetica-Bold')
           .text('Parcel ID:', 50, yPos);
        doc.font('Helvetica')
           .text(titleData.parcel_id, 200, yPos);

        yPos += 30;
        doc.font('Helvetica-Bold')
           .text('Owner:', 50, yPos);
        doc.font('Helvetica')
           .text(titleData.owner_name, 200, yPos);

        yPos += 30;
        doc.font('Helvetica-Bold')
           .text('Location:', 50, yPos);
        doc.font('Helvetica')
           .text(titleData.location, 200, yPos);

        yPos += 30;
        doc.font('Helvetica-Bold')
           .text('Area:', 50, yPos);
        doc.font('Helvetica')
           .text(`${titleData.area} hectares`, 200, yPos);

        yPos += 30;
        doc.font('Helvetica-Bold')
           .text('Land Type:', 50, yPos);
        doc.font('Helvetica')
           .text(titleData.land_type, 200, yPos);

        yPos += 30;
        doc.font('Helvetica-Bold')
           .text('Issue Date:', 50, yPos);
        doc.font('Helvetica')
           .text(new Date(titleData.issue_date).toLocaleDateString('en-GB'), 200, yPos);

        yPos += 30;
        doc.font('Helvetica-Bold')
           .text('Status:', 50, yPos);
        doc.font('Helvetica')
           .text(titleData.status.toUpperCase(), 200, yPos);

        // Blockchain verification
        yPos += 40;
        doc.fontSize(10)
           .font('Helvetica-Bold')
           .text('Blockchain Token ID:', 50, yPos);
        doc.font('Helvetica')
           .fontSize(9)
           .text(titleData.blockchain_token_id || 'N/A', 200, yPos);

        yPos += 20;
        doc.fontSize(10)
           .font('Helvetica-Bold')
           .text('Blockchain Hash:', 50, yPos);
        doc.font('Helvetica')
           .fontSize(8)
           .text(titleData.blockchain_hash || 'N/A', 200, yPos, {
             width: 300
           });

        // QR Code for verification
        doc.image(qrBuffer, doc.page.width - 200, 250, {
          width: 150,
          height: 150
        });

        doc.fontSize(9)
           .text('Scan to verify', doc.page.width - 200, 410, {
             width: 150,
             align: 'center'
           });

        // Signature section
        yPos = doc.page.height - 200;

        doc.fontSize(12)
           .font('Helvetica-Bold')
           .text('Digitally Signed By:', 50, yPos);

        yPos += 20;
        doc.font('Helvetica')
           .fontSize(11)
           .text(titleData.issued_by || 'Lands Commission Officer', 50, yPos);

        yPos += 15;
        doc.fontSize(9)
           .text(`Officer ID: ${titleData.officer_id || 'LC-001'}`, 50, yPos);

        yPos += 15;
        doc.text(`Signature Date: ${new Date().toLocaleDateString('en-GB')}`, 50, yPos);

        // Digital signature (simulated)
        yPos += 30;
        doc.fontSize(8)
           .fillColor('#666666')
           .text('Digital Signature Hash (SHA-256):', 50, yPos);

        yPos += 12;
        const signatureHash = titleData.signature_hash || this.generateDemoSignature(titleData);
        doc.fontSize(7)
           .text(signatureHash, 50, yPos, {
             width: 500
           });

        // Footer
        yPos = doc.page.height - 80;
        doc.fontSize(8)
           .fillColor('#999999')
           .text('This certificate is blockchain-verified and digitally signed.', 50, yPos, {
             align: 'center',
             width: doc.page.width - 100
           });

        yPos += 15;
        doc.fontSize(7)
           .text(`Verification URL: ${verificationUrl}`, 50, yPos, {
             align: 'center',
             width: doc.page.width - 100,
             link: verificationUrl
           });

        yPos += 20;
        doc.fontSize(9)
           .fillColor('#FF0000')
           .text('⚠️ DEMO CERTIFICATE - NOT FOR OFFICIAL USE', 50, yPos, {
             align: 'center',
             width: doc.page.width - 100
           });

        // Production note
        yPos += 15;
        doc.fontSize(7)
           .fillColor('#666666')
           .text('Production: Would include HSM digital signature, holographic watermark, and security features', 50, yPos, {
             align: 'center',
             width: doc.page.width - 100
           });

        // Finalize PDF
        doc.end();

        stream.on('finish', () => {
          resolve(outputPath);
        });

        stream.on('error', reject);

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generate Survey Report PDF
   */
  async generateSurveyReport(surveyData, outputPath) {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        // Header
        doc.fontSize(20).font('Helvetica-Bold').text('LAND SURVEY REPORT', { align: 'center' });
        doc.moveDown();

        // Survey details
        doc.fontSize(12).font('Helvetica-Bold').text('Survey ID:', 50, 100);
        doc.font('Helvetica').text(surveyData.survey_id, 150, 100);

        doc.font('Helvetica-Bold').text('Parcel ID:', 50, 120);
        doc.font('Helvetica').text(surveyData.parcel_id, 150, 120);

        doc.font('Helvetica-Bold').text('Survey Date:', 50, 140);
        doc.font('Helvetica').text(new Date(surveyData.survey_date).toLocaleDateString(), 150, 140);

        doc.font('Helvetica-Bold').text('Instrument:', 50, 160);
        doc.font('Helvetica').text(surveyData.instrument_type, 150, 160);

        doc.font('Helvetica-Bold').text('Accuracy Score:', 50, 180);
        doc.font('Helvetica').text(`${(surveyData.accuracy_score * 100).toFixed(1)}%`, 150, 180);

        doc.font('Helvetica-Bold').text('Surveyor:', 50, 200);
        doc.font('Helvetica').text(surveyData.surveyor_name || 'Licensed Surveyor', 150, 200);

        // Coordinates
        doc.moveDown(2);
        doc.fontSize(14).font('Helvetica-Bold').text('GPS Coordinates:', 50, 240);

        const coords = JSON.parse(surveyData.coordinates || '{}');
        if (coords.center) {
          doc.fontSize(11).font('Helvetica').text(`Center: ${coords.center.lat}, ${coords.center.lng}`, 50, 260);
        }

        if (coords.boundary_points && coords.boundary_points.length > 0) {
          doc.fontSize(12).font('Helvetica-Bold').text('Boundary Points:', 50, 280);
          let yPos = 300;
          coords.boundary_points.forEach((point, index) => {
            doc.fontSize(10).font('Helvetica').text(`Point ${index + 1}: ${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}`, 50, yPos);
            yPos += 15;
          });
        }

        // Notes
        if (surveyData.notes) {
          doc.fontSize(12).font('Helvetica-Bold').text('Notes:', 50, doc.y + 20);
          doc.fontSize(11).font('Helvetica').text(surveyData.notes, 50, doc.y + 5, { width: 500 });
        }

        // QR Code
        const qrData = await QRCode.toDataURL(surveyData.survey_id, { errorCorrectionLevel: 'H', width: 120 });
        const qrBuffer = Buffer.from(qrData.split(',')[1], 'base64');
        doc.image(qrBuffer, doc.page.width - 170, 100, { width: 120 });

        doc.end();
        stream.on('finish', () => resolve(outputPath));
        stream.on('error', reject);

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generate demo digital signature
   */
  generateDemoSignature(data) {
    const crypto = require('crypto');
    const dataString = JSON.stringify(data);
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }
}

module.exports = new PDFGenerator();
