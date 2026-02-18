Project Name: Digital Handover & Sign-off Module (DHSM)
System Context: Integration into the Vision Group CMS.

1. Objective
Digitize the manual "HRSS Handover Report" to eliminate paper-based routing while maintaining formal accountability through a multi-role approval workflow.

2. Stakeholders & Identified Personnel
The system must support the following specific roles/people identified in the legacy process:

The Developer: Initiates the report.


Head of Technology (Paul Ikanza): Infrastructure & Governance sign-off .


Project Manager (Felix Ssembajjwe Bashabe): Functional/Documentation sign-off .


Information Security (Emmanuel Cliff Mughanwa): Security & SSL audit .


End Users (Agatha Joyday Gloria - HR & Marjorie Nalubowa - Manager): Operational readiness & training confirmation .

3. Functional Requirements

Digital Memo Header: Must auto-populate "TO: Head of Technology," "FROM: Project Developer," and "SUBJECT: [Project Name] Handover Report" .

System Specification Module: Fields for:


Hosting: VPS Environment (Primary IP: 170.187.146.79) .


Access: Public URL (https://hr.visiongroup.co.ug) and SSL Status.

Sequential Approval Workflow:

Developer submits Memo.

PM and Security review simultaneously.

Head of Tech reviews after technical sign-offs.

End Users sign off last after training is confirmed.


Conditional Logic: If a user selects "No, with comments" for any checkpoint, the status flips to "Action Required" (Red) and notifies the Developer.