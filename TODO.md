# TODO - Admin Management (Doctor verification/approval/suspension/analytics/reports)

- [ ] Step 1: Confirm admin endpoints already exist for:
  - [ ] Doctor registration + OTP flow
  - [ ] Admin doctor verification/approval/suspend/deactivate/reactivate workflow
  - [ ] Admin dashboard stats
  - [ ] Admin analytics (charts/cards)
  - [ ] Admin platform report
- [ ] Step 2: Confirm frontend pages/components already call these endpoints:
  - [ ] ManageDoctors.jsx workflow action dispatch
  - [ ] Analytics.jsx analytics fetching
- [ ] Step 3: Validate frontend API mappings for those endpoints in authService.js
  - [ ] updateDoctorApprovalStatus
  - [ ] getAdminAnalytics
  - [ ] generatePlatformReport (if UI exists)
- [ ] Step 4: If any endpoint/UI mismatch is found, implement minimal missing wiring (no extra features beyond what’s required).
- [ ] Step 5: Run backend + frontend build/tests (if possible) to ensure routes work.

