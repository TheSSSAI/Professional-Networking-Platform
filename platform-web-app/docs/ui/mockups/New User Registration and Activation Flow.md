# 1 Diagram Info

## 1.1 Diagram Name

New User Registration and Activation Flow

## 1.2 Diagram Type

sequenceDiagram

## 1.3 Purpose

To document the end-to-end user registration journey, from form submission to account activation, highlighting the synchronous API flow for user creation and the asynchronous, event-driven process for email verification.

## 1.4 Target Audience

- developers
- QA engineers
- product managers
- security analysts

## 1.5 Complexity Level

medium

## 1.6 Estimated Review Time

5-7 minutes

# 2.0 Mermaid Implementation

| Property | Value |
|----------|-------|
| Mermaid Code | sequenceDiagram
    actor "Web Client (SPA)" as We... |
| Syntax Validation | Mermaid syntax verified and tested for correctness... |
| Rendering Notes | Optimized for readability in both light and dark t... |

# 3.0 Diagram Elements

## 3.1 Actors Systems

- User (via Web Client SPA)
- API Gateway (AWS)
- Identity & Access Service (NestJS Microservice)
- Event Bus (SNS/SQS)
- Notifications Service (NestJS Microservice with AWS SES)

## 3.2 Key Processes

- Client-side Validation
- Server-side Validation
- User Record Creation (in PostgreSQL)
- Token Generation & Storage
- Asynchronous Event Publishing
- Email Dispatch via AWS SES
- Token Validation
- Account Activation

## 3.3 Decision Points

- Server-side validation (e.g., email uniqueness, password complexity, age)
- Token validation (is token valid, expired, or already used?)

## 3.4 Success Paths

- User successfully registers, receives an email, clicks the verification link, and activates their account.

## 3.5 Error Scenarios

- Invalid form data (client-side or server-side)
- Email already registered
- Invalid or expired verification link
- Email service (AWS SES) is unavailable

## 3.6 Edge Cases Covered

- User clicks the verification link multiple times.
- Asynchronous decoupling of email sending from the main registration API response.

# 4.0 Accessibility Considerations

| Property | Value |
|----------|-------|
| Alt Text | A sequence diagram illustrating the new user regis... |
| Color Independence | Information is conveyed through sequential flow, l... |
| Screen Reader Friendly | All participants, actors, and interactions have cl... |
| Print Compatibility | Diagram uses standard shapes and lines that render... |

# 5.0 Technical Specifications

| Property | Value |
|----------|-------|
| Mermaid Version | 10.0+ compatible |
| Responsive Behavior | The diagram scales to fit various screen widths, s... |
| Theme Compatibility | Works with default, dark, and neutral Mermaid them... |
| Performance Notes | The diagram is of medium complexity and should ren... |

# 6.0 Usage Guidelines

## 6.1 When To Reference

During the development, testing, or review of the user registration, account activation, and initial onboarding user stories (US-001, US-002, US-003, US-008).

## 6.2 Stakeholder Value

| Property | Value |
|----------|-------|
| Developers | Provides a clear, step-by-step guide for implement... |
| Designers | Validates the user experience flow, including feed... |
| Product Managers | Offers a comprehensive overview of the entire regi... |
| Qa Engineers | Defines the complete testable flow, including sync... |

## 6.3 Maintenance Notes

This diagram should be updated if the registration flow changes, if a new step is added (e.g., CAPTCHA), or if the inter-service communication protocol is modified (e.g., from gRPC to REST).

## 6.4 Integration Recommendations

Embed this diagram directly into the relevant epic or user story in Jira/Confluence and in the README.md file for the Identity & Access Service.

# 7.0 Validation Checklist

- ✅ All critical user paths documented from registration to activation.
- ✅ Asynchronous email flow is clearly separated from the synchronous API response.
- ✅ Decision points like server-side validation and token validation are implicitly or explicitly covered.
- ✅ Mermaid syntax is validated and renders correctly.
- ✅ Diagram serves the needs of developers, QA, and product managers.
- ✅ The sequence of events is logical and easy to follow.
- ✅ Notes provide valuable context about design decisions (e.g., async decoupling).
- ✅ The diagram is accessible and does not rely solely on color for information.

