# MediAlert Pro - Medicine Expiry Notification App

A comprehensive medicine expiry notification app that helps users track medication inventory, receive timely alerts, manage stock levels, and facilitate easy reordering.

## Features

### Core Features
- **Medicine Management System**: Track medicines with expiry dates, quantities, and categories
- **Smart Alert System**: Multi-layered notifications for expiry, low stock, and reminders
- **OCR Integration**: Scan medicine labels automatically to extract information
- **Cross-platform**: Works on iOS and Android devices

### Technical Stack
- **Backend**: Python Flask API with SQLite database
- **Frontend**: React Native (to be implemented)
- **Database**: SQLite with proper schema for medicines, alerts, and user settings

## Getting Started

### Backend Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the Flask server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

### API Endpoints

- `GET/POST /api/medicines` - List all medicines or add new medicine
- `GET/PUT/DELETE /api/medicines/<id>` - Get, update, or delete specific medicine
- `GET /api/alerts/check` - Check for new alerts
- `GET /api/alerts` - Get all alerts
- `PUT /api/alerts/<id>/sent` - Mark alert as sent
- `GET/PUT /api/settings` - Get or update user settings

## Database Schema

### Medicines Table
- `id`: Primary key
- `name`: Medicine name
- `brand`: Brand name
- `generic_name`: Generic name
- `category`: prescription, otc, or supplement
- `expiry_date`: When the medicine expires
- `purchase_date`: When purchased
- `quantity`: Current stock
- `min_threshold`: Alert threshold
- `batch_number`: Batch/lot number
- `manufacturer`: Manufacturer name
- `price`: Purchase price
- `storage_location`: Where stored

### Alerts Table
- `id`: Primary key
- `medicine_id`: Reference to medicine
- `alert_type`: expiry, low_stock, or reminder
- `alert_date`: When to show alert
- `message`: Alert message
- `is_sent`: Whether sent to user

### User Settings Table
- `alert_days_before`: JSON array of days for expiry alerts
- `notification_preferences`: JSON notification settings
- `email_alerts`: Whether to send email alerts

## Development Roadmap

### Phase 1: MVP (Current)
- ✅ Flask backend with database
- ✅ Basic medicine CRUD operations
- ✅ Alert system for expiry and low stock
- ⏳ React Native frontend structure

### Phase 2: Enhanced Features
- OCR integration for label scanning
- Push notifications
- Medicine search and filters
- Backup/restore functionality

### Phase 3: Advanced Features
- Medicine substitution suggestions
- Pharmacy location integration
- Reorder functionality
- Analytics dashboard
- Multi-user family sharing

## Contributing

This is a comprehensive project with multiple phases. Start with the MVP and gradually add features based on user feedback.

## License

MIT License - see LICENSE file for details.
