from django.shortcuts import render
from django.http import JsonResponse
from .utils import extract_text_from_image, extract_entities

def upload_document(request):
    if request.method == 'POST' and request.FILES['document']:
        document = request.FILES['document']
        # Assuming the document is an image for OCR
        text = extract_text_from_image(document)
        entities = extract_entities(text)
        return JsonResponse({'entities': entities})
    return render(request, 'upload.html')
