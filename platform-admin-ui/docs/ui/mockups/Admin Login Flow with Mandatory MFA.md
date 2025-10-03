# 1 Diagram Info

## 1.1 Diagram Name

Admin Login Flow with Mandatory MFA

## 1.2 Diagram Type

sequenceDiagram

## 1.3 Purpose

Documents the critical-path entry point for all administrators, including the mandatory MFA step which is a core security requirement (REQ-1-040).

## 1.4 Target Audience

- developers
- security analysts
- QA engineers
- architects

## 1.5 Complexity Level

medium

## 1.6 Estimated Review Time

3-5 minutes

# 2.0 Mermaid Implementation

| Property | Value |
|----------|-------|
| Mermaid Code | sequenceDiagram
    actor Administrator
    partic... |
| Syntax Validation | Mermaid syntax verified and tested for rendering. |
| Rendering Notes | Optimized for a top-to-bottom flow, clearly showin... |

# 3.0 Diagram Elements

## 3.1 Actors Systems

- Administrator
- Client (Admin UI)
- API Gateway
- Identity & Access Service

## 3.2 Key Processes

- Password & Role Verification
- MFA Token Issuance (Temporary)
- MFA Code (TOTP) Validation
- Final Session Token Issuance

## 3.3 Decision Points

- Are credentials valid and is user an admin?
- Is the MFA code valid?

## 3.4 Success Paths

- Successful authentication after passing both password and MFA checks, leading to a redirect to the Admin Dashboard.

## 3.5 Error Scenarios

- Login attempt with invalid email, password, or non-admin role.
- Login attempt with a valid password but an invalid or expired MFA code.

## 3.6 Edge Cases Covered

- The flow implicitly covers the case where a new admin must set up MFA, as the check for MFA status would precede step 4a.
- The use of a temporary `mfaSessionToken` prevents bypassing the MFA step.

# 4.0 Accessibility Considerations

| Property | Value |
|----------|-------|
| Alt Text | Sequence diagram of the Admin Login Flow. An admin... |
| Color Independence | Information is conveyed through sequential flow an... |
| Screen Reader Friendly | All actors, systems, and interactions have clear, ... |
| Print Compatibility | The diagram is a standard sequence diagram and pri... |

# 5.0 Technical Specifications

| Property | Value |
|----------|-------|
| Mermaid Version | 10.0+ compatible |
| Responsive Behavior | The diagram will scale horizontally. On smaller vi... |
| Theme Compatibility | Uses standard MermaidJS elements and syntax, compa... |
| Performance Notes | The diagram is of low complexity and will render q... |

# 6.0 Usage Guidelines

## 6.1 When To Reference

During development of the admin authentication flow, security reviews, and QA test case creation for REQ-1-040.

## 6.2 Stakeholder Value

| Property | Value |
|----------|-------|
| Developers | Provides a clear sequence of API calls and state t... |
| Designers | Validates the user journey for a multi-step login ... |
| Product Managers | Confirms the implementation aligns with the securi... |
| Qa Engineers | Defines the happy path and critical error paths (i... |

## 6.3 Maintenance Notes

Update this diagram if the authentication flow changes, for example, by adding recovery code options or different second-factor methods.

## 6.4 Integration Recommendations

Embed this diagram directly in the Confluence/Notion page for the Admin Security epic or within the README of the Identity & Access Service.

# 7.0 Validation Checklist

- ✅ Documents the two-phase login process (password + MFA).
- ✅ Includes error paths for invalid credentials and invalid MFA codes.
- ✅ Clearly shows the interaction between the client, gateway, and identity service.
- ✅ Mermaid syntax is validated and renders correctly.
- ✅ The purpose of documenting REQ-1-040 is fulfilled.
- ✅ The flow is logical and easy for technical stakeholders to follow.
- ✅ Styling is minimal and does not distract from the content.
- ✅ Text labels are clear and concise.

