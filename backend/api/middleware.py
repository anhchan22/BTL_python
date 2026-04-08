import logging

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware:
    """Log all API requests"""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Log request
        if request.path.startswith('/api/'):
            logger.info(f"{request.method} {request.path} - User: {request.user}")

        response = self.get_response(request)

        # Log response status
        if request.path.startswith('/api/') and response.status_code >= 400:
            logger.warning(f"{request.method} {request.path} - Status: {response.status_code}")

        return response
