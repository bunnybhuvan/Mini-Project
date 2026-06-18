import firebase_admin
from firebase_admin import credentials, firestore, storage

# Load the service account JSON
cred = credentials.Certificate('serviceAccountKey.json')  # path to uploaded JSON
firebase_admin.initialize_app(cred, {
    'storageBucket': 'resumetrix.appspot.com'  # your Firebase Storage bucket
})

# Firestore client
db = firestore.client()

# Storage client
bucket = storage.bucket()

# Example: fetch all guides
guides = db.collection('guides').stream()
for g in guides:
    print(g.to_dict())
