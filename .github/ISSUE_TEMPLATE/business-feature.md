---
name: Business Feature
about: Template for ensuring Github Issues for Business Feature are ready for implementation
title: '[Business Feature] '
labels:
    - 'business-feature'
assignees: ''
---

## Business Context

[Link to event storming board / frame](https://miro.com/app/board/uXjVLHsoB8Q=/?share_link_id=452457263599&moveToWidget=3458764620210737332&cot=14)

[Link to Mockups in Figma](https://www.figma.com/design/Z7SZqVqazEXpGeZWPwjtpE/Planeroo?node-id=2579-11463&p=f&t=1ssOCUZ2F5SvRYCF-0)

Any questions about Business Context can be clarified on
[Discord General Channel](https://discord.com/channels/1344794673293819958/1344794779224899624)

### Business Scenarios

1. `Event Manager` creates a new event for existing customer
2. `Event Manager` creates a new event for new customer
3. `Event Manager` assigns team members
4. `Event Manager` adds first Note manually in system
5. `Event Manager` copies eventID and forwards email from customer
6. ~~`Event Manager` generates Brief based on Notes with use of AI~~ (OUT OF SCOPE)
7. `Event Manager` manually updates Brief

### Business Rules

- Event Assignment Rule:

    - Only assigned users can modify an event's details or assign other users
    - A user must be assigned to an event to have update permissions
    - The first assignee can be set by any tenant user, but subsequent assignments require the assigner to be already assigned to the event

- Tenant Isolation Rule:
    - Customers are tenant-scoped
    - All event operations are tenant-scoped
    - Users can only perform actions on events within their tenant
    - Event visibility and all operations (read, update, assign, archive) require tenant membership

## API Contract

- [Events API Contract](https://github.com/Planeroo/api-contracts/blob/master/services/events/events.yaml)
- [Briefs API Contract](https://github.com/Planeroo/api-contracts/blob/master/services/events/briefs.yaml)
- [Customers API Contract](https://github.com/Planeroo/api-contracts/blob/master/services/customers/customers.yaml)

Any questions about API Contract can be clarified on
[Discord Enginering Channel](https://discord.com/channels/1344794673293819958/1344794674799448188)

## Technical Requirements

For that feature our [Technical Standard]([Link to technical standard](https://github.com/Planeroo/inquiries-service/blob/main/docs/architecture-and-patterns.md)) should be user.

Any questions about technical requirements or implementation challenges can be clarified on
[Discord Enginering Channel](https://discord.com/channels/1344794673293819958/1344794674799448188)

## In Scope

- Domain Model matching rules with unit tests
- Controller fulfilling API Contract
- NoSQL persistence
- NestJS Module
- End-to-end tests for Business Scenarios

## Out of Scope

- UI
- JWT security implementation
- Adapter for Integration with OpenAI
- Adapter for Integration with Emails
- Implementation of `Customers Module`
- Scenario: `Event Manager` generates Brief based on Notes with use of AI
