import pytesseract
from transformers import pipeline

# Initialize the BERT NER pipeline
ner_pipeline = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english")

def extract_text_from_image(image_path):
    """
    Extract text from an image using Tesseract OCR.
    """
    text = pytesseract.image_to_string(image_path)
    return text

def extract_entities(text):
    """
    Extract named entities from text using BERT.
    """
    entities = ner_pipeline(text)
    return entities
