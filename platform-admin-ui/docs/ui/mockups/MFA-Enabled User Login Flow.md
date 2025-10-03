# 1 Diagram Info

## 1.1 Diagram Name

MFA-Enabled User Login Flow

## 1.2 Diagram Type

flowchart

## 1.3 Purpose

To visually document the complete, two-phase login process for a user who has Multi-Factor Authentication (MFA) enabled, including password validation, MFA code validation, and handling of failure scenarios.

## 1.4 Target Audience

- developers
- QA engineers
- security analysts
- product managers

## 1.5 Complexity Level

medium

## 1.6 Estimated Review Time

3 minutes

# 2.0 Mermaid Implementation

| Property | Value |
|----------|-------|
| Mermaid Code | flowchart TD
    subgraph Phase 1: Password Valida... |
| Syntax Validation | Mermaid syntax verified and tested for rendering. |
| Rendering Notes | Optimized for a top-down flow. Subgraphs are used ... |

# 3.0 Diagram Elements

## 3.1 Actors Systems

- User
- Client Application (SPA)
- API Gateway
- Identity & Access Service

## 3.2 Key Processes

- Password validation
- MFA status check
- Temporary token generation
- MFA code validation
- Account lockout logic
- Session token issuance

## 3.3 Decision Points

- Is password valid?
- Is MFA enabled?
- Is MFA code valid?
- Have failed attempts exceeded the limit?

## 3.4 Success Paths

- Successful login for non-MFA user
- Successful login for MFA-enabled user

## 3.5 Error Scenarios

- Incorrect password
- Incorrect MFA code
- Account lockout due to too many failed MFA attempts

## 3.6 Edge Cases Covered

- Differentiating between password failure and MFA failure
- Handling users with and without MFA in the same flow

# 4.0 Accessibility Considerations

| Property | Value |
|----------|-------|
| Alt Text | A flowchart detailing the user login process with ... |
| Color Independence | Information is conveyed through node shapes, text ... |
| Screen Reader Friendly | All nodes have clear, descriptive text labels that... |
| Print Compatibility | The diagram uses distinct shapes and clear text, m... |

# 5.0 Technical Specifications

| Property | Value |
|----------|-------|
| Mermaid Version | 10.0+ compatible |
| Responsive Behavior | The flowchart scales well and remains readable on ... |
| Theme Compatibility | The diagram uses basic Mermaid features and classe... |
| Performance Notes | The diagram is of medium complexity and renders qu... |

# 6.0 Usage Guidelines

## 6.1 When To Reference

During development of the authentication service, frontend login components, security reviews, and for QA test case creation.

## 6.2 Stakeholder Value

| Property | Value |
|----------|-------|
| Developers | Provides a clear, step-by-step logic map for imple... |
| Designers | Validates the multi-step user journey and ensures ... |
| Product Managers | Offers a comprehensive overview of a critical secu... |
| Qa Engineers | Defines all possible paths, including success, fai... |

## 6.3 Maintenance Notes

Update this diagram if the MFA attempt limit, lockout duration, or the temporary token mechanism is changed.

## 6.4 Integration Recommendations

Embed this diagram in the main authentication feature documentation, within the relevant user stories (US-019, US-082), and in the security architecture overview.

# 7.0 Validation Checklist

- ✅ All critical user paths documented
- ✅ Error scenarios and recovery paths included
- ✅ Decision points clearly marked with conditions
- ✅ Mermaid syntax validated and renders correctly
- ✅ Diagram serves intended audience needs
- ✅ Visual hierarchy supports easy comprehension
- ✅ Styling enhances rather than distracts from content
- ✅ Accessible to users with different visual abilities

