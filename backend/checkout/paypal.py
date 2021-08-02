from core.settings.base import FATOWL_CLIENT_ID, FATOWL_CLIENT_SECRET
from paypalcheckoutsdk.core import PayPalHttpClient, SandboxEnvironment


class PaypalClient:
    def __init__(self):
        self.client_id = FATOWL_CLIENT_ID
        self.client_secret = FATOWL_CLIENT_SECRET
        self.environment = SandboxEnvironment(
            client_id=self.client_id, client_secret=self.client_secret
        )
        self.client = PayPalHttpClient(self.environment)
