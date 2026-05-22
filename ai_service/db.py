import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/vitamed") # Default fallback if needed

def get_db():
    try:
        client = MongoClient(MONGO_URI)
        # Note: Depending on the URI format, the database name might be in the URI or it uses default.
        # usually in standard MERN stacks it's added at the end like mongodb://.../vitamed
        db = client.get_default_database()
        return db
    except Exception as e:
        # Fallback to parse it manually if get_default_database fails (i.e., no DB in URI)
        try:
            client = MongoClient(MONGO_URI)
            # Find the database name from URI, or default to "vitamed"
            db_name = MONGO_URI.split('/')[-1].split('?')[0]
            if not db_name:
                db_name = "test"
            return client[db_name]
        except Exception as inner_e:
            print("MongoDB Connection Error:", inner_e)
            return None

def fetch_doctors_context():
    db = get_db()
    if db is None:
        return "Database connection unavailable."
    
    try:
        doctors_collection = db["doctors"] # Name of the collection usually is 'doctors' from mongoose
        doctors = list(doctors_collection.find({}))
        
        context = ""
        for doc in doctors:
            context += f"ID: {str(doc.get('_id', 'Unknown'))}\n"
            context += f"Doctor Name: {doc.get('name', 'Unknown')}\n"
            context += f"Speciality: {doc.get('speciality', 'Unknown')}\n"
            context += f"Experience: {doc.get('experience', 'Unknown')}\n"
            context += f"Fees: {doc.get('fees', 'Unknown')}\n"
            
            # Format slots booked
            slots_booked = doc.get("slots_booked", {})
            if slots_booked and slots_booked != {}:
                context += f"Booked Slots (unavailable): {slots_booked}\n"
            else:
                context += f"Booked Slots: None (Fully available)\n"
            context += "---\n"
            
        return context
    except Exception as e:
        print("Error fetching doctors:", e)
        return "Failed to fetch doctors from database."
