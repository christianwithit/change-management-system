# Quick Start Guide - Testing Vision Group CMS

## 🚀 Get Started in 3 Steps

### Step 1: Open Test Page
```
Open: pages/test-all-features.html
```

### Step 2: See Mock Data Load
The page automatically loads:
- ✅ 3 Handover Documents
- ✅ 10 Projects
- ✅ 6 Test Users

### Step 3: Start Testing!
Click any button to test features.

## 🎯 Quick Tests

### Test 1: View Handovers (30 seconds)
1. Click "View All Handovers"
2. See 3 handovers in different states
3. Click any handover to view details

### Test 2: Initiate Handover (2 minutes)
1. Click "Test Initiate Handover"
2. Edit any fields you want
3. Click "Initiate Handover"
4. See new handover created

### Test 3: Sign Handover (1 minute)
1. Login as: felix / password
2. Go to handover HO-2026-002
3. Check all boxes
4. Click "Approve & Sign"
5. See signature recorded

### Test 4: Switch Users (30 seconds)
1. Click any user card
2. Login with their credentials
3. See different permissions
4. Test their features

## 🔐 Test Credentials

All passwords are: **password**

| Username | Role | What to Test |
|----------|------|--------------|
| felix | Developer | Initiate handovers, sign as developer |
| emmanuel | Developer | Sign security reviews |
| paul | Admin | Full access, allocate projects |
| agatha | HOD | Review requests, sign as end user |
| marjorie | HOD | Review requests, sign as end user |
| staff | Staff | Submit requests only |

## 📊 What's Available

### Handovers
- **HO-2026-001**: ✅ Completed (view only)
- **HO-2026-002**: ⏳ Needs PM & Security signatures
- **HO-2026-003**: ⏳ Needs Security signature

### Projects Ready for Handover
- **CR-2026-004**: Document Management System
- **CR-2026-005**: Fleet Management System

## 🎨 Features to Test

### Handover Features
- ✅ View handover list
- ✅ View handover details
- ✅ Initiate new handover
- ✅ Edit all sections
- ✅ Sign handovers
- ✅ Complete workflow

### Editable Sections
- ✅ System Overview
- ✅ Purpose (add/remove items)
- ✅ Hosting Details (6 fields)
- ✅ System Users (add/remove)
- ✅ Current Status (add/remove)

### User Roles
- ✅ Developer permissions
- ✅ Security permissions
- ✅ Admin permissions
- ✅ HOD permissions
- ✅ Staff permissions

## 🐛 Troubleshooting

### Issue: Page doesn't load
**Fix**: Check that all script files exist

### Issue: No data showing
**Fix**: Open browser console, check for errors

### Issue: Can't login
**Fix**: Use password: "password" for all users

### Issue: Modal doesn't open
**Fix**: Ensure handover-initiate.js is loaded

## 📚 More Help

- **TESTING_GUIDE.md**: Detailed testing instructions
- **MOCK_DATA_SUMMARY.md**: Complete data overview
- **HANDOVER_EDITABLE_GUIDE.md**: Handover feature guide

## ✨ That's It!

You're ready to test all features with comprehensive mock data.

**Happy Testing!** 🎉
