"""
MediAlert Pro - Medicine Expiry Notification App
Backend API built with Flask
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json
from datetime import datetime, timedelta
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React Native frontend

# Database setup
DATABASE = 'medialert.db'

def get_db():
    """Get database connection"""
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db

def init_db():
    """Initialize database with required tables"""
    with app.app_context():
        db = get_db()

        # Create medicines table
        db.execute('''
            CREATE TABLE IF NOT EXISTS medicines (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                brand TEXT,
                generic_name TEXT,
                category TEXT CHECK(category IN ('prescription', 'otc', 'supplement')),
                expiry_date DATE NOT NULL,
                purchase_date DATE,
                quantity INTEGER DEFAULT 0,
                min_threshold INTEGER DEFAULT 5,
                batch_number TEXT,
                manufacturer TEXT,
                price DECIMAL(10,2),
                storage_location TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Create alerts table
        db.execute('''
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                medicine_id INTEGER,
                alert_type TEXT CHECK(alert_type IN ('expiry', 'low_stock', 'reminder')),
                alert_date DATE,
                message TEXT,
                is_sent BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (medicine_id) REFERENCES medicines(id)
            )
        ''')

        # Create user_settings table
        db.execute('''
            CREATE TABLE IF NOT EXISTS user_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER UNIQUE,
                alert_days_before TEXT DEFAULT '[7, 15, 30]',
                notification_preferences TEXT DEFAULT '{"email": true, "push": true, "sound": true}',
                email_alerts BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Insert default user settings if not exists
        db.execute('''
            INSERT OR IGNORE INTO user_settings (user_id)
            VALUES (1)
        ''')

        db.commit()

# Initialize database on startup
init_db()

class MediAlert:
    """Main application class for MediAlert Pro"""

    def __init__(self):
        self.db = get_db()

    def add_medicine(self, name, expiry_date, quantity, **kwargs):
        """Add a new medicine to the database"""
        cursor = self.db.cursor()

        # Calculate purchase date if not provided
        purchase_date = kwargs.get('purchase_date', datetime.now().date())

        cursor.execute('''
            INSERT INTO medicines (
                name, brand, generic_name, category, expiry_date, purchase_date,
                quantity, min_threshold, batch_number, manufacturer, price, storage_location
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            name, kwargs.get('brand'), kwargs.get('generic_name'),
            kwargs.get('category', 'otc'), expiry_date, purchase_date,
            quantity, kwargs.get('min_threshold', 5), kwargs.get('batch_number'),
            kwargs.get('manufacturer'), kwargs.get('price'), kwargs.get('storage_location')
        ))

        medicine_id = cursor.lastrowid
        self.db.commit()

        # Check for alerts after adding medicine
        self._check_alerts_for_medicine(medicine_id)

        return medicine_id

    def get_medicines(self):
        """Get all medicines"""
        cursor = self.db.cursor()
        cursor.execute('SELECT * FROM medicines ORDER BY expiry_date')
        return [dict(row) for row in cursor.fetchall()]

    def get_medicine(self, medicine_id):
        """Get a specific medicine"""
        cursor = self.db.cursor()
        cursor.execute('SELECT * FROM medicines WHERE id = ?', (medicine_id,))
        row = cursor.fetchone()
        return dict(row) if row else None

    def update_medicine(self, medicine_id, **kwargs):
        """Update medicine information"""
        cursor = self.db.cursor()

        # Build dynamic update query
        fields = []
        values = []

        for key, value in kwargs.items():
            if key != 'id':  # Don't update id
                fields.append(f"{key} = ?")
                values.append(value)

        if fields:
            values.append(medicine_id)
            cursor.execute(f'''
                UPDATE medicines SET {', '.join(fields)}, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', values)

            self.db.commit()

            # Recheck alerts after update
            self._check_alerts_for_medicine(medicine_id)

            return True
        return False

    def delete_medicine(self, medicine_id):
        """Delete a medicine"""
        cursor = self.db.cursor()
        cursor.execute('DELETE FROM medicines WHERE id = ?', (medicine_id,))
        cursor.execute('DELETE FROM alerts WHERE medicine_id = ?', (medicine_id,))
        self.db.commit()
        return cursor.rowcount > 0

    def check_expiry_alerts(self):
        """Check for medicines expiring soon and create alerts"""
        cursor = self.db.cursor()

        # Get user settings for alert days
        cursor.execute('SELECT alert_days_before FROM user_settings WHERE user_id = 1')
        settings = cursor.fetchone()
        alert_days = json.loads(settings['alert_days_before']) if settings else [7, 15, 30]

        # Check each medicine for expiry alerts
        cursor.execute('SELECT * FROM medicines WHERE quantity > 0')
        medicines = cursor.fetchall()

        for medicine in medicines:
            expiry_date = datetime.strptime(medicine['expiry_date'], '%Y-%m-%d').date()
            today = datetime.now().date()

            days_until_expiry = (expiry_date - today).days

            for days in alert_days:
                if days_until_expiry == days:
                    alert_date = today + timedelta(days=days)
                    message = f"{medicine['name']} expires in {days} days ({expiry_date})"

                    # Check if alert already exists
                    cursor.execute('''
                        SELECT id FROM alerts
                        WHERE medicine_id = ? AND alert_type = 'expiry' AND alert_date = ?
                    ''', (medicine['id'], alert_date.strftime('%Y-%m-%d')))

                    if not cursor.fetchone():
                        cursor.execute('''
                            INSERT INTO alerts (medicine_id, alert_type, alert_date, message)
                            VALUES (?, 'expiry', ?, ?)
                        ''', (medicine['id'], alert_date.strftime('%Y-%m-%d'), message))

        self.db.commit()

    def check_low_stock_alerts(self):
        """Check for low stock medicines and create alerts"""
        cursor = self.db.cursor()

        cursor.execute('''
            SELECT * FROM medicines WHERE quantity > 0 AND quantity <= min_threshold
        ''')
        medicines = cursor.fetchall()

        for medicine in medicines:
            # Check if low stock alert already exists
            cursor.execute('''
                SELECT id FROM alerts
                WHERE medicine_id = ? AND alert_type = 'low_stock' AND is_sent = FALSE
            ''', (medicine['id'],))

            if not cursor.fetchone():
                message = f"{medicine['name']} is running low (Quantity: {medicine['quantity']})"
                cursor.execute('''
                    INSERT INTO alerts (medicine_id, alert_type, alert_date, message)
                    VALUES (?, 'low_stock', ?, ?)
                ''', (medicine['id'], datetime.now().date().strftime('%Y-%m-%d'), message))

        self.db.commit()

    def _check_alerts_for_medicine(self, medicine_id):
        """Check and create alerts for a specific medicine"""
        self.check_expiry_alerts()
        self.check_low_stock_alerts()

    def get_alerts(self, limit=50):
        """Get recent alerts"""
        cursor = self.db.cursor()
        cursor.execute('''
            SELECT a.*, m.name as medicine_name
            FROM alerts a
            JOIN medicines m ON a.medicine_id = m.id
            ORDER BY a.created_at DESC LIMIT ?
        ''', (limit,))
        return [dict(row) for row in cursor.fetchall()]

    def mark_alert_sent(self, alert_id):
        """Mark an alert as sent"""
        cursor = self.db.cursor()
        cursor.execute('UPDATE alerts SET is_sent = TRUE WHERE id = ?', (alert_id,))
        self.db.commit()
        return cursor.rowcount > 0

# Initialize the app instance
medialert = MediAlert()

# API Routes
@app.route('/api/medicines', methods=['GET', 'POST'])
def handle_medicines():
    """Handle medicine CRUD operations"""
    if request.method == 'POST':
        data = request.get_json()

        if not data or not data.get('name') or not data.get('expiry_date'):
            return jsonify({'error': 'Name and expiry_date are required'}), 400

        try:
            medicine_id = medialert.add_medicine(
                name=data['name'],
                expiry_date=data['expiry_date'],
                quantity=data.get('quantity', 0),
                brand=data.get('brand'),
                generic_name=data.get('generic_name'),
                category=data.get('category', 'otc'),
                purchase_date=data.get('purchase_date'),
                min_threshold=data.get('min_threshold', 5),
                batch_number=data.get('batch_number'),
                manufacturer=data.get('manufacturer'),
                price=data.get('price'),
                storage_location=data.get('storage_location')
            )

            return jsonify({'id': medicine_id, 'message': 'Medicine added successfully'}), 201

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    else:  # GET
        medicines = medialert.get_medicines()
        return jsonify(medicines)

@app.route('/api/medicines/<int:medicine_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_medicine(medicine_id):
    """Handle individual medicine operations"""
    if request.method == 'GET':
        medicine = medialert.get_medicine(medicine_id)
        if medicine:
            return jsonify(medicine)
        return jsonify({'error': 'Medicine not found'}), 404

    elif request.method == 'PUT':
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        success = medialert.update_medicine(medicine_id, **data)
        if success:
            return jsonify({'message': 'Medicine updated successfully'})
        return jsonify({'error': 'Medicine not found'}), 404

    elif request.method == 'DELETE':
        success = medialert.delete_medicine(medicine_id)
        if success:
            return jsonify({'message': 'Medicine deleted successfully'})
        return jsonify({'error': 'Medicine not found'}), 404

@app.route('/api/alerts/check', methods=['GET'])
def check_alerts():
    """Check for new alerts and return them"""
    medialert.check_expiry_alerts()
    medialert.check_low_stock_alerts()

    alerts = medialert.get_alerts()
    return jsonify(alerts)

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    """Get all alerts"""
    alerts = medialert.get_alerts()
    return jsonify(alerts)

@app.route('/api/alerts/<int:alert_id>/sent', methods=['PUT'])
def mark_alert_sent(alert_id):
    """Mark an alert as sent"""
    success = medialert.mark_alert_sent(alert_id)
    if success:
        return jsonify({'message': 'Alert marked as sent'})
    return jsonify({'error': 'Alert not found'}), 404

@app.route('/api/settings', methods=['GET', 'PUT'])
def handle_settings():
    """Handle user settings"""
    if request.method == 'PUT':
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        cursor = medialert.db.cursor()

        # Update settings
        for key, value in data.items():
            if key in ['alert_days_before', 'notification_preferences', 'email_alerts']:
                if key == 'alert_days_before' or key == 'notification_preferences':
                    value = json.dumps(value)
                cursor.execute(f'UPDATE user_settings SET {key} = ? WHERE user_id = 1', (value,))

        medialert.db.commit()
        return jsonify({'message': 'Settings updated successfully'})

    else:  # GET
        cursor = medialert.db.cursor()
        cursor.execute('SELECT * FROM user_settings WHERE user_id = 1')
        settings = dict(cursor.fetchone()) if cursor.fetchone() else {}

        # Parse JSON fields
        if settings.get('alert_days_before'):
            settings['alert_days_before'] = json.loads(settings['alert_days_before'])
        if settings.get('notification_preferences'):
            settings['notification_preferences'] = json.loads(settings['notification_preferences'])

        return jsonify(settings)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
