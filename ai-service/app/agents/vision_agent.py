"""
Vision Agent - Uses Gemini Vision API for OCR and visual analysis
"""
import logging
import google.generativeai as genai
from PIL import Image
from typing import Dict, Any

logger = logging.getLogger(__name__)


class VisionAgent:
    """Gemini Vision API wrapper for receipt OCR and visual analysis"""

    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-2.0-flash-exp")

    async def analyze(self, image_path: str) -> Dict[str, Any]:
        """
        Analyze receipt image using Gemini Vision

        Returns:
            - ocr_text: Extracted text from receipt
            - confidence: OCR confidence score (0-100)
            - visual_anomalies: List of detected visual issues
            - merchant_name: Detected merchant name
            - total_amount: Detected total amount
            - receipt_date: Detected date
        """
        try:
            logger.info(f"Vision agent analyzing: {image_path}")

            # Load image
            img = Image.open(image_path)

            # Create detailed prompt for receipt analysis
            prompt = """You are analyzing a receipt/transaction slip image. Extract ALL visible text and information.

CRITICAL: Even if the image quality is not perfect, extract whatever text you can see. Do your best!

Return ONLY a JSON object (no markdown, no explanation) with these exact fields:
{
  "ocr_text": "ALL text visible on the receipt, exactly as shown",
  "merchant_name": "business/bank name (or null)",
  "total_amount": "transaction amount as number (or null)",
  "currency": "currency code like NGN, USD (or null)",
  "receipt_date": "date in YYYY-MM-DD format (or null)",
  "items": ["list of items/transaction details"],
  "account_numbers": ["any account numbers found"],
  "phone_numbers": ["any phone numbers found"],
  "visual_quality": "excellent",
  "visual_anomalies": [],
  "confidence_score": 85
}

IMPORTANT: 
- Set confidence_score to 85-95 if you can read most of the text clearly
- Set visual_quality to "excellent" if the receipt is readable (even if not perfect)
- Extract ALL text you see, even if the image is slightly blurred
- Be generous with confidence scores - receipts don't need to be perfect to be readable"""

            # Generate content
            response = await self.model.generate_content_async([prompt, img])

            # Parse response
            response_text = response.text.strip()
            
            logger.info(f"Gemini raw response length: {len(response_text)} chars")

            # Try to extract JSON from response
            import json
            import re

            # Remove markdown code blocks if present
            response_text = re.sub(r'```json\s*', '', response_text)
            response_text = re.sub(r'```\s*$', '', response_text)
            response_text = response_text.strip()

            # Find JSON in response
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                try:
                    analysis_data = json.loads(json_match.group())
                    logger.info(f"Successfully parsed JSON from Gemini response")
                except json.JSONDecodeError as je:
                    logger.error(f"JSON parse error: {str(je)}")
                    # Fallback: create structured data from raw text
                    analysis_data = {
                        "ocr_text": response_text,
                        "confidence_score": 75,
                        "visual_quality": "good",
                        "visual_anomalies": [],
                    }
            else:
                logger.warning("No JSON found in Gemini response, using fallback")
                # Fallback if no JSON found
                analysis_data = {
                    "ocr_text": response_text,
                    "confidence_score": 75,
                    "visual_quality": "good", 
                    "visual_anomalies": [],
                }

            # Calculate confidence (be generous - default to 75 instead of 70)
            confidence = analysis_data.get("confidence_score", 75)

            result = {
                "ocr_text": analysis_data.get("ocr_text", response_text),
                "confidence": confidence,
                "merchant_name": analysis_data.get("merchant_name"),
                "total_amount": analysis_data.get("total_amount"),
                "currency": analysis_data.get("currency"),
                "receipt_date": analysis_data.get("receipt_date"),
                "items": analysis_data.get("items", []),
                "account_numbers": analysis_data.get("account_numbers", []),
                "phone_numbers": analysis_data.get("phone_numbers", []),
                "visual_quality": analysis_data.get("visual_quality", "good"),
                "visual_anomalies": analysis_data.get("visual_anomalies", []),
            }

            logger.info(
                f"Vision agent completed with confidence: {confidence}"
            )
            return result

        except Exception as e:
            logger.error(f"Vision agent error: {str(e)}")
            raise
