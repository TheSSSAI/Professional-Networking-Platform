# 1 Diagram Info

## 1.1 Diagram Name

Admin Login Flow (MFA and Non-MFA Paths)

## 1.2 Diagram Type

sequenceDiagram

## 1.3 Purpose

Clearly visualizes the login sequence for admins, distinguishing between the flow for users who have MFA configured and the mandatory setup flow for those who do not, as per security requirements SRS-001-F8 and user stories US-082 & US-083.

## 1.4 Target Audience

- developers
- security engineers
- QA engineers
- technical product managers

## 1.5 Complexity Level

medium

## 1.6 Estimated Review Time

3-5 minutes

# 2.0 Mermaid Implementation

| Property | Value |
|----------|-------|
| Mermaid Code | sequenceDiagram
    actor Admin
    participant Ad... |
| Syntax Validation | Mermaid syntax verified and tested for rendering. |
| Rendering Notes | Optimized for clarity with `alt` blocks to show co... |

# 3.0 Diagram Elements

## 3.1 Actors Systems

- Admin User
- Admin Frontend (SPA)
- API Gateway
- Identity & Access Service

## 3.2 Key Processes

- Password Validation
- Role Check
- MFA Status Check
- TOTP Code Verification
- Mandatory MFA Setup Flow

## 3.3 Decision Points

- Are credentials valid?
- Is the user an administrator?
- Is MFA enabled for the admin account?

## 3.4 Success Paths

- Successful login for an MFA-enabled administrator.
- Redirection to the mandatory MFA setup page for a new or non-configured administrator.

## 3.5 Error Scenarios

- Incorrect password or non-admin role.
- Incorrect TOTP code during MFA verification.

## 3.6 Edge Cases Covered

- First-time login for a user who was just granted admin privileges but has not yet configured MFA.

# 4.0 Accessibility Considerations

| Property | Value |
|----------|-------|
| Alt Text | A sequence diagram illustrating the admin login pr... |
| Color Independence | Information is conveyed through flow and text labe... |
| Screen Reader Friendly | All participants and interactions have clear, desc... |
| Print Compatibility | Diagram is line-based and renders clearly in black... |

# 5.0 Technical Specifications

| Property | Value |
|----------|-------|
| Mermaid Version | 10.0+ compatible |
| Responsive Behavior | Diagram scales effectively for both wide and narro... |
| Theme Compatibility | Works with default, dark, and neutral Mermaid them... |
| Performance Notes | The diagram is of low complexity and will render q... |

# 6.0 Usage Guidelines

## 6.1 When To Reference

During development of the admin authentication flow, security reviews, and QA test planning for user stories US-082 and US-083.

## 6.2 Stakeholder Value

| Property | Value |
|----------|-------|
| Developers | Provides a clear, step-by-step guide for implement... |
| Designers | Validates the user flow and the number of screens/... |
| Product Managers | Visually confirms that the security requirement fo... |
| Qa Engineers | Outlines the specific paths that need to be tested... |

## 6.3 Maintenance Notes

Update this diagram if the MFA requirements change or if new authentication steps (e.g., SSO) are added for administrators.

## 6.4 Integration Recommendations

Embed directly into the Confluence/Notion pages for US-082 and US-083. Link to it from the main system architecture documentation on authentication.

# 7.0 Validation Checklist

- ✅ All critical user paths documented
- ✅ Error scenarios and recovery paths included
- ✅ Decision points clearly marked with conditions
- ✅ Mermaid syntax validated and renders correctly
- ✅ Diagram serves intended audience needs
- ✅ Visual hierarchy supports easy comprehension
- ✅ Styling enhances rather than distracts from content
- ✅ Accessible to users with different visual abilities

