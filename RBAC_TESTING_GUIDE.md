# 🧪 RBAC Testing Guide

## Quick Test Scenarios

### Test 1: SuperAdmin Access
**Login as**: `superadmin@arogyanexa.system`

**Expected Behavior**:
1. ✅ Can access `/superadmin`
2. ✅ Sees "System Monitor" in navbar
3. ✅ Dashboard shows ONLY system metrics (API health, database, etc.)
4. ✅ NO business data visible
5. ✅ Sidebar has: System Monitor, API Health, System Logs, Admin Management
6. ✅ Trying to access `/admin/dashboard` → redirects to `/superadmin`
7. ✅ Trying to access `/admin/products` → redirects to `/superadmin`
8. ✅ Trying to access `/admin/users` → redirects to `/superadmin`

**Test Commands**:
```bash
# Navigate to these URLs and verify redirect
http://localhost:3001/admin/dashboard  # Should redirect to /superadmin
http://localhost:3001/admin/products   # Should redirect to /superadmin
http://localhost:3001/admin/orders     # Should redirect to /superadmin
```

---

### Test 2: Admin Access
**Login as**: `aris.thorne@arogyanexa.com`

**Expected Behavior**:
1. ✅ Can access all `/admin/*` routes
2. ✅ Sees "Admin" link in navbar
3. ✅ Can view products, orders, users, CRM
4. ✅ User list does NOT show SuperAdmin
5. ✅ Can create Doctor, Pharmacist, Content Editor
6. ✅ Trying to access `/superadmin` → shows 403 or redirects
7. ✅ Dashboard shows business metrics

**Test Commands**:
```bash
# Navigate to these URLs and verify access
http://localhost:3001/admin/dashboard  # Should work
http://localhost:3001/admin/products   # Should work
http://localhost:3001/admin/users      # Should work (no SuperAdmin in list)
http://localhost:3001/superadmin       # Should be blocked
```

---

### Test 3: Doctor Access
**Login as**: `sarah.alfarsi@arogyanexa.com`

**Expected Behavior**:
1. ✅ Can access `/doctor`
2. ✅ Sees "Doctor Portal" in navbar
3. ✅ Can view prescriptions
4. ✅ Can approve/reject prescriptions
5. ✅ Cannot access `/admin/*`
6. ✅ Cannot access `/superadmin`
7. ✅ Cannot access `/pharmacist/*`

---

### Test 4: Pharmacist Access
**Login as**: `sarah.miller@arogyanexa.com`

**Expected Behavior**:
1. ✅ Can access `/pharmacist/*`
2. ✅ Sees "Pharmacist" in navbar
3. ✅ Can review prescriptions
4. ✅ Can manage inventory
5. ✅ Can process orders
6. ✅ Cannot access `/admin/*`
7. ✅ Cannot access `/superadmin`
8. ✅ Cannot access `/doctor`

---

### Test 5: Content Editor Access
**Login as**: `elena.sterling@arogyanexa.com`

**Expected Behavior**:
1. ✅ Can access `/admin/content`
2. ✅ Sees "Content" in navbar
3. ✅ Can create/edit articles
4. ✅ Cannot access other `/admin/*` routes
5. ✅ Cannot access `/superadmin`
6. ✅ Cannot access `/doctor` or `/pharmacist`

---

### Test 6: Customer Access
**Login as**: `julian.vane@example.com`

**Expected Behavior**:
1. ✅ Can access `/dashboard` (patient dashboard)
2. ✅ Can access `/profile`
3. ✅ Can access `/orders` (own orders only)
4. ✅ Can access `/prescriptions` (own prescriptions only)
5. ✅ Can place orders
6. ✅ Cannot access `/admin/*`
7. ✅ Cannot access `/superadmin`
8. ✅ Cannot access `/doctor` or `/pharmacist`

---

## Automated Test Script

```typescript
// test/rbac.test.ts
describe('RBAC Tests', () => {
  describe('SuperAdmin', () => {
    it('can access /superadmin', async () => {
      // Login as SuperAdmin
      // Navigate to /superadmin
      // Assert: page loads successfully
    });

    it('cannot access /admin/dashboard', async () => {
      // Login as SuperAdmin
      // Navigate to /admin/dashboard
      // Assert: redirected to /superadmin
    });

    it('sees only system monitoring data', async () => {
      // Login as SuperAdmin
      // Navigate to /superadmin
      // Assert: no business data visible
      // Assert: API health visible
      // Assert: system metrics visible
    });
  });

  describe('Admin', () => {
    it('can access all admin routes', async () => {
      // Login as Admin
      // Navigate to /admin/dashboard
      // Assert: page loads successfully
    });

    it('cannot see SuperAdmin users', async () => {
      // Login as Admin
      // Navigate to /admin/users
      // Assert: SuperAdmin not in user list
    });

    it('cannot access /superadmin', async () => {
      // Login as Admin
      // Navigate to /superadmin
      // Assert: 403 or redirect
    });
  });

  describe('Doctor', () => {
    it('can access doctor portal', async () => {
      // Login as Doctor
      // Navigate to /doctor
      // Assert: page loads successfully
    });

    it('cannot access admin routes', async () => {
      // Login as Doctor
      // Navigate to /admin/dashboard
      // Assert: 403 or redirect
    });
  });

  describe('Pharmacist', () => {
    it('can access pharmacist portal', async () => {
      // Login as Pharmacist
      // Navigate to /pharmacist/prescriptions
      // Assert: page loads successfully
    });

    it('cannot access admin routes', async () => {
      // Login as Pharmacist
      // Navigate to /admin/dashboard
      // Assert: 403 or redirect
    });
  });

  describe('Customer', () => {
    it('can access own profile', async () => {
      // Login as Customer
      // Navigate to /profile
      // Assert: page loads successfully
    });

    it('cannot access admin routes', async () => {
      // Login as Customer
      // Navigate to /admin/dashboard
      // Assert: 403 or redirect
    });
  });
});
```

---

## Manual Testing Checklist

### SuperAdmin Tests
- [ ] Login with SuperAdmin credentials
- [ ] Verify dashboard shows system monitoring only
- [ ] Try to access `/admin/dashboard` - should redirect
- [ ] Try to access `/admin/products` - should redirect
- [ ] Try to access `/admin/users` - should redirect
- [ ] Verify navbar shows "System Monitor"
- [ ] Verify no business data visible
- [ ] Verify API health metrics visible
- [ ] Verify database metrics visible

### Admin Tests
- [ ] Login with Admin credentials
- [ ] Access `/admin/dashboard` - should work
- [ ] Access `/admin/products` - should work
- [ ] Access `/admin/users` - should work
- [ ] Verify SuperAdmin NOT in user list
- [ ] Try to access `/superadmin` - should be blocked
- [ ] Verify can see all business data
- [ ] Verify navbar shows "Admin"

### Doctor Tests
- [ ] Login with Doctor credentials
- [ ] Access `/doctor` - should work
- [ ] Try to access `/admin/dashboard` - should be blocked
- [ ] Try to access `/superadmin` - should be blocked
- [ ] Verify navbar shows "Doctor Portal"

### Pharmacist Tests
- [ ] Login with Pharmacist credentials
- [ ] Access `/pharmacist/prescriptions` - should work
- [ ] Try to access `/admin/dashboard` - should be blocked
- [ ] Try to access `/superadmin` - should be blocked
- [ ] Verify navbar shows "Pharmacist"

### Customer Tests
- [ ] Register new customer account
- [ ] Login with customer credentials
- [ ] Access `/dashboard` - should work
- [ ] Access `/profile` - should work
- [ ] Try to access `/admin/dashboard` - should be blocked
- [ ] Try to access `/superadmin` - should be blocked

---

## Test Data

### SuperAdmin
```json
{
  "email": "superadmin@arogyanexa.system",
  "password": "SuperAdmin123!",
  "role": "SUPER_ADMIN"
}
```

### Admin
```json
{
  "email": "aris.thorne@arogyanexa.com",
  "password": "Admin123!",
  "role": "ADMIN"
}
```

### Doctor
```json
{
  "email": "sarah.alfarsi@arogyanexa.com",
  "password": "Doctor123!",
  "role": "DOCTOR"
}
```

### Pharmacist
```json
{
  "email": "sarah.miller@arogyanexa.com",
  "password": "Pharmacist123!",
  "role": "PHARMACIST"
}
```

### Content Editor
```json
{
  "email": "elena.sterling@arogyanexa.com",
  "password": "Editor123!",
  "role": "CONTENT_EDITOR"
}
```

### Customer
```json
{
  "email": "julian.vane@example.com",
  "password": "Customer123!",
  "role": "CUSTOMER"
}
```

---

## Expected Results Summary

| Role | /superadmin | /admin/* | /doctor | /pharmacist/* | /dashboard |
|------|-------------|----------|---------|---------------|------------|
| SUPER_ADMIN | ✅ | ❌ | ❌ | ❌ | ❌ |
| ADMIN | ❌ | ✅ | ❌ | ❌ | ✅ |
| DOCTOR | ❌ | ❌ | ✅ | ❌ | ✅ |
| PHARMACIST | ❌ | ❌ | ❌ | ✅ | ✅ |
| CONTENT_EDITOR | ❌ | ✅* | ❌ | ❌ | ✅ |
| CUSTOMER | ❌ | ❌ | ❌ | ❌ | ✅ |

*Content Editor can only access `/admin/content`

---

## Troubleshooting

### Issue: SuperAdmin can still access admin routes
**Solution**: Check that `blockSuperAdmin={true}` is added to ProtectedRoute in admin pages

### Issue: Admin can see SuperAdmin users
**Solution**: Verify user list filtering in `app/admin/users/page.tsx`

### Issue: Role checks not working
**Solution**: Check `useAuth` hook and ensure roles are properly loaded from Redux store

### Issue: Redirects not working
**Solution**: Verify ProtectedRoute component logic and router.replace calls

---

## Performance Testing

### Load Test Scenarios
1. **100 concurrent SuperAdmin logins** - should all redirect properly
2. **1000 concurrent Admin user list requests** - should filter SuperAdmin
3. **Mixed role access** - verify no cross-role data leakage

---

## Security Testing

### Penetration Test Scenarios
1. **JWT Token Manipulation** - try to change role in token
2. **Direct URL Access** - try to access blocked routes directly
3. **API Endpoint Testing** - verify backend also enforces RBAC
4. **Session Hijacking** - verify role cannot be elevated

---

**Last Updated**: December 2024  
**Status**: Ready for Testing  
**Priority**: High - Security Critical

