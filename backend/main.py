from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app, origins='*')

def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='Theilliad123@',
        database='flight_tracking'
    )

def create_get_all_route(table_name):
    def get_all_records():
        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(f"SELECT * FROM {table_name};")
            rows = cursor.fetchall()
            column_names = [desc[0] for desc in cursor.description]
            results = [dict(zip(column_names, row)) for row in rows]
            return jsonify(results)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            cursor.close()
            conn.close()

    app.add_url_rule(
        rule=f'/api/{table_name}',
        endpoint=f'get_all_{table_name}',
        view_func=get_all_records,
        methods=['GET']
    )

# List of all tables from your SQL file
tables = [
    'airline',
    'location',
    'airplane',
    'airport',
    'person',
    'passenger',
    'passenger_vacations',
    'leg',
    'route',
    'route_path',
    'flight',
    'pilot',
    'pilot_licenses'
]

# Stored procedure names from your SQL file
procedures = [
    'add_airplane',
    'add_airport',
    'add_person',
    'grant_or_revoke_pilot_license',
    'offer_flight',
    'flight_landing',
    'flight_takeoff',
    'passengers_board',
    'passengers_disembark',
    'assign_pilot',
    'recycle_crew',
    'retire_flight',
    'simulation_cycle'
]

# Dynamically create GET routes for each table
for table in tables:
    create_get_all_route(table)

# Create POST endpoints for stored procedures
@app.route('/api/procedure/<procedure_name>', methods=['POST'])
def call_stored_procedure(procedure_name):
    if procedure_name not in procedures:
        return jsonify({"error": "Procedure not allowed."}), 403

    params = request.json.get('params', [])

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.callproc(procedure_name, params)
        conn.commit()

        # Collect result sets if any
        results = []
        for result in cursor.stored_results():
            column_names = [desc[0] for desc in result.description]
            rows = result.fetchall()
            results.append([dict(zip(column_names, row)) for row in rows])

        return jsonify({"result": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    app.run(debug=True, port=8080)