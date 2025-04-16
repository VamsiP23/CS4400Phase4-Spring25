from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector


app = Flask(__name__)
cors = CORS(app, origins='*')

def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='Theilliad123@',
        database='flight_tracking'
    )

@app.route('/api/locations', methods=['GET'])
def get_locations():
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM Location;")
        rows = cursor.fetchall()

        # Get column names
        column_names = [desc[0] for desc in cursor.description]

        # Convert each row to a dictionary
        results = [dict(zip(column_names, row)) for row in rows]

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


# @app.route("/api/users", methods=['GET'])
# def users():
#         return jsonify(
#                 {
#                         "users": [
#                                 'arpan',
#                                 'zach',
#                                 'jessie'
#                         ]
#                 }
#         )

if __name__ == "__main__":
    app.run(debug=True, port=8080)