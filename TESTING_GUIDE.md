# HOD Review Feature - Testing Guide

## Quick Start Testing

### Step 1: Login as HOD
1. Open `index.html` in your browser
2. Enter credentials:
   - **Username**: `hod`
   - **Password**: `hod123`
3. Click "Login"

### Step 2: Navigate to HOD Review
1. You should be redirected to the dashboard
2. Look at the sidebar navigation
3. Click on "HOD Review" (should be visible since you're logged in as HOD)

### Step 3: View Dashboard Statistics
You should see 4 stat cards at the top:
- **Pending Review**: Should show 3 (three pending requests)
- **Clarifications**: Should show 1 (one request with clarification requested)
- **Approved**: Should show count of approved requests
- **Rejected**: Should show count of rejected requests

### Step 4: Test Filtering
1. Try filtering by **Status**: Select "Pending Review"
2. Try filtering by **Priority**: Select "High"
3. Try filtering by **Staff Member**: Select a staff name
4. Click "Apply Filters" to see results

### Step 5: Review a Request
1. Click the "Review" button on any request (e.g., CR-2026-147)
2. A modal should open showing:
   - Request details (ID, priority, staff member, date)
   - Title and description
   - Type, justification, and expected benefits
   - Five action buttons

### Step 6: Test Each Action

#### Test 1: Ask for Clarification
1. Click "Ask for Clarification" button
2. A form should appear below
3. Enter a question in the text area (e.g., "Can you provide more details about the expected user count?")
4. Click "Submit"
5. You should see a success alert
6. The modal should close
7. The request status should update to "Clarification Requested"

#### Test 2: Accept Request
1. Open another pending request
2. Click "Accept Request" button
3. Optionally add approval comments
4. Click "Submit"
5. Request should be marked as "Approved"
6. Status should change to "Pending IT Review"

#### Test 3: Reject Request
1. Open another pending request
2. Click "Reject Request" button
3. Select a reason from dropdown (e.g., "Budget Constraints")
4. Add rejection comments (required)
5. Click "Submit"
6. Request should be marked as "Rejected"

#### Test 4: Already in Development
1. Open a pending request
2. Click "Already in Development" button
3. Add details about the current development
4. Click "Submit"
5. Request should be closed with status "Already in Development"

#### Test 5: Already in Use
1. Open a pending request
2. Click "Already in Use" button
3. Add details about the existing solution
4. Click "Submit"
5. Request should be closed with status "Already in Use"

### Step 7: Verify Statistics Update
After taking actions, the statistics at the top should update automatically:
- Pending count should decrease
- Approved/Rejected counts should increase accordingly

### Step 8: Test Refresh
1. Click the "Refresh" button in the top-right
2. The page should reload data
3. All your changes should persist (in the mock data)

### Step 9: Test Mobile Responsiveness
1. Resize your browser window to mobile size (< 768px)
2. The sidebar should hide
3. A hamburger menu icon should appear
4. Click it to open the sidebar
5. The sidebar should slide in from the left
6. Click outside to close it

### Step 10: Test Access Control
1. Logout (click Logout button in sidebar)
2. Login as a staff member:
   - **Username**: `staff`
   - **Password**: `staff123`
3. Check the sidebar - "HOD Review" link should NOT be visible
4. Try to manually navigate to `pages/hod-review.html`
5. You should be redirected or see an access denied message

## Expected Test Results

### ✅ Pass Criteria
- [ ] HOD can login successfully
- [ ] HOD Review link is visible in navigation
- [ ] Statistics display correctly
- [ ] Filters work as expected
- [ ] All 5 actions can be performed
- [ ] Request statuses update correctly
- [ ] Modal opens and closes properly
- [ ] Form validation works (required fields)
- [ ] Statistics update after actions
- [ ] Mobile sidebar works correctly
- [ ] Non-HOD users cannot access the page

### ❌ Known Limitations (Mock Data)
- Changes don't persist after page refresh (no backend)
- No real email notifications
- No real-time updates
- Clarification responses not implemented yet
- No actual IT queue integration (will be added later)

## Test Data Available

### IT Department Requests (for HOD testing)
1. **CR-2026-147**: Employee Self-Service Portal
   - Status: Pending HOD Review
   - Priority: High
   - Staff: Sarah Nakato

2. **CR-2026-148**: Network Infrastructure Upgrade
   - Status: Pending HOD Review
   - Priority: Medium
   - Staff: John Okello

3. **CR-2026-149**: Automated Backup Solution
   - Status: Pending HOD Review
   - Priority: High
   - Staff: Mary Achieng

4. **CR-2026-150**: Mobile Device Management System
   - Status: Clarification Requested
   - Priority: Low
   - Staff: David Musoke

## Troubleshooting

### Issue: HOD Review link not showing
**Solution**: Make sure you're logged in as HOD (username: `hod`, password: `hod123`)

### Issue: No requests showing
**Solution**: The HOD user is assigned to "IT Department". Make sure there are requests for that department in the mock data.

### Issue: Modal not opening
**Solution**: Check browser console for JavaScript errors. Make sure all JS files are loaded correctly.

### Issue: Actions not working
**Solution**: Check that `hod-review.js` is loaded after `mock-data.js` and other dependencies.

### Issue: Statistics not updating
**Solution**: The `updateStatistics()` function should be called after `loadRequests()`. Check the console for errors.

## Browser Compatibility
Tested on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Edge (latest)
- ✅ Safari (latest)

## Performance Notes
- Page loads quickly with mock data
- Modal animations are smooth
- No noticeable lag with current dataset size
- Filters apply instantly

## Security Notes
- Client-side authentication (for demo purposes only)
- No sensitive data exposure
- Role-based access control implemented
- XSS protection through proper escaping (to be enhanced)

---

**Happy Testing! 🚀**

If you find any issues, please document them with:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser and version
5. Screenshots (if applicable)
