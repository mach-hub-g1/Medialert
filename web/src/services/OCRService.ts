import { Alert } from '../store/types';

export interface OCRResult {
  text: string;
  confidence: number;
  boundingBoxes?: Array<{
    text: string;
    confidence: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}

export interface ExtractedMedicineInfo {
  name?: string;
  brand?: string;
  expiry_date?: string;
  batch_number?: string;
  manufacturer?: string;
}

class OCRService {
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    // In a real implementation, this would initialize the OCR engine
    // For now, we'll simulate initialization
    this.isInitialized = true;
    return true;
  }

  async scanImage(imageUri: string): Promise<OCRResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Simulate OCR processing
    // In a real implementation, this would use Google ML Kit, Tesseract, or similar
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          text: this.simulateOCRText(),
          confidence: 0.85,
          boundingBoxes: [],
        });
      }, 2000); // Simulate processing time
    });
  }

  extractMedicineInfo(ocrText: string): ExtractedMedicineInfo {
    const lines = ocrText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    const result: ExtractedMedicineInfo = {};

    // Common patterns for medicine labels
    const patterns = {
      expiry: /(?:exp|expiry|expires?|use by|best before)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
      batch: /(?:batch|lot|lot no|batch no)[\s:]*([a-zA-Z0-9\-]+)/i,
      manufacturer: /(?:mfg|manufactured|made by)[\s:]*([a-zA-Z\s&.,]+?)(?:\n|$)/i,
    };

    for (const line of lines) {
      // Try to extract expiry date
      const expiryMatch = line.match(patterns.expiry);
      if (expiryMatch && !result.expiry_date) {
        result.expiry_date = this.normalizeDate(expiryMatch[1]);
      }

      // Try to extract batch number
      const batchMatch = line.match(patterns.batch);
      if (batchMatch && !result.batch_number) {
        result.batch_number = batchMatch[1];
      }

      // Try to extract manufacturer
      const manufacturerMatch = line.match(patterns.manufacturer);
      if (manufacturerMatch && !result.manufacturer) {
        result.manufacturer = manufacturerMatch[1].trim();
      }
    }

    // Try to identify medicine name (usually the first prominent text)
    if (lines.length > 0) {
      // Look for capitalized words that might be medicine names
      for (const line of lines.slice(0, 3)) {
        if (line.length > 3 && line.length < 50 && /^[A-Z\s]+$/.test(line)) {
          result.name = line.trim();
          break;
        }
      }

      // If no clear name found, use the first line
      if (!result.name) {
        result.name = lines[0];
      }
    }

    return result;
  }

  private simulateOCRText(): string {
    // Simulate OCR text extraction from a medicine label
    const samples = [
      `PARACETAMOL 500MG TABLETS
Manufactured by: Cipla Ltd.
Batch No: PCM23001
Expiry: 12/2025
Mfg Date: 01/2023`,

      `ASPIRIN 75MG TABLETS
Brand: Bayer
Lot Number: ASP-2024-567
Expires: 06/2026
Made by: Bayer Healthcare`,

      `VITAMIN D3 1000IU CAPSULES
Manufactured by: Sun Pharma
Batch: VD32024
Expiry Date: 03/2025
Use by: March 2025`,
    ];

    return samples[Math.floor(Math.random() * samples.length)];
  }

  private normalizeDate(dateStr: string): string {
    // Normalize various date formats to YYYY-MM-DD
    const datePatterns = [
      /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, // DD/MM/YYYY or DD-MM-YYYY
      /(\d{1,2})[\/\-](\d{2})$/, // DD/MM/YY or DD-MM-YY
    ];

    for (const pattern of datePatterns) {
      const match = dateStr.match(pattern);
      if (match) {
        let [, day, month, year] = match;

        // Convert 2-digit year to 4-digit
        if (year && year.length === 2) {
          year = '20' + year;
        }

        // Ensure month and day are 2 digits
        month = month.padStart(2, '0');
        day = day.padStart(2, '0');

        return `${year}-${month}-${day}`;
      }
    }

    return dateStr; // Return as-is if no pattern matches
  }

  async processImageForOCR(imageUri: string): Promise<{
    success: boolean;
    data?: ExtractedMedicineInfo;
    error?: string;
  }> {
    try {
      const ocrResult = await this.scanImage(imageUri);
      const extractedInfo = this.extractMedicineInfo(ocrResult.text);

      return {
        success: true,
        data: extractedInfo,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'OCR processing failed',
      };
    }
  }
}

export const ocrService = new OCRService();
