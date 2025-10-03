# MediAlert Pro - Setup and Development Guide

## 🚀 Quick Start

### Backend Setup (Python Flask)

1. **Install Python Dependencies**
```bash
cd c:\Users\gajen\projects\BHAIYA
pip install -r requirements.txt
```

2. **Run the Flask Backend**
```bash
python app.py
```
The API will be available at `http://localhost:5000`

### Frontend Setup (React Native)

1. **Install Node.js Dependencies**
```bash
npm install
```

2. **Install React Native CLI** (if not already installed)
```bash
npm install -g @react-native-community/cli
```

3. **Install iOS Dependencies** (macOS only)
```bash
cd ios && pod install && cd ..
```

4. **Run on Android**
```bash
npm run android
```

5. **Run on iOS** (macOS only)
```bash
npm run ios
```

## 📱 Testing the Application

### 1. Start the Backend
```bash
python app.py
```

### 2. Test API Endpoints

**Add a Medicine:**
```bash
curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Paracetamol",
    "expiry_date": "2024-12-31",
    "quantity": 20,
    "category": "otc"
  }'
```

**Get All Medicines:**
```bash
curl http://localhost:5000/api/medicines
```

**Check for Alerts:**
```bash
curl http://localhost:5000/api/alerts/check
```

### 3. Test Frontend Features

1. **Dashboard**: View medicine overview and alerts
2. **Add Medicine**: Add medicines with OCR scanning (simulated)
3. **Medicine List**: Browse and search medicines
4. **Alerts**: View and manage notifications
5. **Settings**: Configure notification preferences

## 🔧 Development Workflow

### Adding New Features

1. **Backend Changes**
   - Modify `app.py` for new API endpoints
   - Update database schema if needed
   - Test with curl/Postman

2. **Frontend Changes**
   - Update TypeScript interfaces in `store/types.ts`
   - Modify Redux slices in `store/slices/`
   - Create/update React components
   - Update API service calls in `services/ApiService.ts`

### Database Management

The app uses SQLite with the following main tables:
- `medicines`: Store medicine information
- `alerts`: Track notifications and alerts
- `user_settings`: User preferences

### Testing OCR Functionality

The OCR service is simulated but ready for integration with:
- Google ML Kit
- Azure Computer Vision
- AWS Textract

## 📋 MVP Features Completed ✅

- [x] Flask backend with REST API
- [x] SQLite database with proper schema
- [x] Medicine CRUD operations
- [x] Smart alert system (expiry & low stock)
- [x] React Native frontend structure
- [x] Redux state management
- [x] Basic UI components (Dashboard, Medicine List, Add Medicine, Alerts, Settings)
- [x] OCR service (simulated)
- [x] Notification service (simulated)

## 🎯 Next Development Phases

### Phase 2: Enhanced Features (In Progress)
- [ ] Real OCR integration with camera
- [ ] Push notifications with Firebase
- [ ] Barcode/QR code scanning
- [ ] Medicine search and filters
- [ ] Backup/restore functionality

### Phase 3: Advanced Features
- [ ] Medicine substitution suggestions
- [ ] Pharmacy location integration
- [ ] Reorder functionality with supplier APIs
- [ ] Analytics dashboard
- [ ] Multi-user family sharing
- [ ] Cloud synchronization

## 🛠 Troubleshooting

### Common Issues

1. **Backend not starting**: Check if port 5000 is available
2. **Database errors**: Delete `medialert.db` and restart the app
3. **React Native issues**: Clear Metro cache with `npm start --reset-cache`
4. **iOS build issues**: Run `cd ios && pod install`

### Logs and Debugging

- **Backend logs**: Check console output when running `python app.py`
- **React Native logs**: Use `react-native log-android` or `react-native log-ios`
- **Redux logs**: Enable Redux DevTools for state debugging

## 📚 API Documentation

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medicines` | Get all medicines |
| POST | `/api/medicines` | Add new medicine |
| GET | `/api/medicines/:id` | Get specific medicine |
| PUT | `/api/medicines/:id` | Update medicine |
| DELETE | `/api/medicines/:id` | Delete medicine |
| GET | `/api/alerts/check` | Check for new alerts |
| GET | `/api/alerts` | Get all alerts |
| PUT | `/api/alerts/:id/sent` | Mark alert as sent |
| GET/PUT | `/api/settings` | Get/update user settings |

## 🔒 Security Considerations

- Input validation on all API endpoints
- SQL injection prevention with parameterized queries
- CORS configuration for cross-origin requests
- Error handling without information leakage
- Data encryption for sensitive information (to be implemented)

## 📖 Learning Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Native Documentation](https://reactnative.dev/)
- [Redux Toolkit Guide](https://redux-toolkit.js.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

This is a comprehensive medicine management application. The MVP is complete and ready for testing. Continue development by implementing the enhanced features in Phase 2.

**Next Priority**: Integrate real OCR functionality and push notifications for a fully functional medicine expiry tracking app.
