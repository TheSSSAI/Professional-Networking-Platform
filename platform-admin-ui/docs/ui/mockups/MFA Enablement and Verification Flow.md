# 1 Diagram Info

## 1.1 Diagram Name

MFA Enablement and Verification Flow

## 1.2 Diagram Type

flowchart

## 1.3 Purpose

To visually document the complete user journey for setting up Multi-Factor Authentication (MFA) using a TOTP app and the subsequent two-step login process for an MFA-enabled account.

## 1.4 Target Audience

- developers
- security engineers
- QA engineers
- product managers

## 1.5 Complexity Level

high

## 1.6 Estimated Review Time

5-7 minutes

# 2.0 Mermaid Implementation

| Property | Value |
|----------|-------|
| Mermaid Code | flowchart TD
    subgraph MFA Enablement Flow (US-... |
| Syntax Validation | Mermaid syntax verified and tested |
| Rendering Notes | Optimized for both light and dark themes using dis... |

# 3.0 Diagram Elements

## 3.1 Actors Systems

- User
- Frontend Application
- Backend Identity Service
- Authenticator App
- Database

## 3.2 Key Processes

- Secret Key Generation
- QR Code Display
- TOTP Code Verification
- Recovery Code Generation
- Two-Step Login

## 3.3 Decision Points

- Credentials Valid?
- MFA Enabled?
- TOTP Code Valid?
- Failed Attempts Threshold Reached?

## 3.4 Success Paths

- Successful MFA enablement
- Successful login with MFA

## 3.5 Error Scenarios

- Incorrect TOTP code during setup
- Incorrect TOTP code during login
- Account lockout on too many attempts

## 3.6 Edge Cases Covered

- User cancels setup
- Recovery code usage (implied path)
- Login for non-MFA user

# 4.0 Accessibility Considerations

| Property | Value |
|----------|-------|
| Alt Text | Flowchart detailing the user journey for both enab... |
| Color Independence | Information is conveyed through node shapes, text ... |
| Screen Reader Friendly | All nodes have clear and descriptive text labels t... |
| Print Compatibility | Diagram uses distinct shapes and clear text, makin... |

# 5.0 Technical Specifications

| Property | Value |
|----------|-------|
| Mermaid Version | 10.0+ compatible |
| Responsive Behavior | The flowchart scales appropriately for both deskto... |
| Theme Compatibility | The diagram uses explicit styling classes that are... |
| Performance Notes | The diagram is of moderate complexity but should r... |

# 6.0 Usage Guidelines

## 6.1 When To Reference

During the implementation, review, and testing of the MFA feature, specifically user stories US-018 (Enable MFA) and US-019 (Login with MFA).

## 6.2 Stakeholder Value

| Property | Value |
|----------|-------|
| Developers | Provides a clear, step-by-step guide for implement... |
| Designers | Validates the user flow and identifies all necessa... |
| Product Managers | Offers a comprehensive overview of the entire feat... |
| Qa Engineers | Serves as a definitive source for creating a compl... |

## 6.3 Maintenance Notes

Update this diagram if the MFA policy changes (e.g., number of failed attempts, lockout duration) or if new MFA factors (e.g., SMS, YubiKey) are introduced.

## 6.4 Integration Recommendations

Embed this diagram directly in the Confluence/Jira tickets for US-018 and US-019, as well as in the main technical design document for the authentication system.

# 7.0 Validation Checklist

- ✅ All critical user paths documented
- ✅ Error scenarios and recovery paths included
- ✅ Decision points clearly marked with conditions
- ✅ Mermaid syntax validated and renders correctly
- ✅ Diagram serves intended audience needs
- ✅ Visual hierarchy supports easy comprehension
- ✅ Styling enhances rather than distracts from content
- ✅ Accessible to users with different visual abilities

