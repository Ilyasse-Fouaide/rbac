# nodejs rbac (role bases access control)

- [x] assign user to role when register.
- [x] assign role to permission.
- [x] create middleware requirePermissions.

- [x] create logger using winstone.
- [x] compress the old log files with `npm install winston-daily-rotate-file` [hint](https://medium.com/@bjprajapati381/using-winston-for-logging-in-node-js-applications-d15302947c28)

### What next

- [x] Implement Rate Limiting

  - Protect your API from abuse and malicious users by limiting the number of requests a user can make in a given time window (e.g., 100 requests per minute).

- [x] Improve API Security

  - **CORS Configuration**: Ensure proper Cross-Origin Resource Sharing (CORS) settings to control which domains can access your
    API.

- [x] refresh_token and access_token mechanism

- [x] automate eslinter

- [x] Implement a Role Management Dashboard for admins to create, assign, and edit roles and permissions dynamically.

- [x] Fix - assigning role to user on google authentication.

- [ ] Inherit permissions

- [x] Remove the associated roles/permissions from the `role_permissions` model when deleting roles/permissions

- [ ] Add `user_permissions` model

- [ ] add user management

  - [ ] display detailled users info as roles and permissions

- [ ] update package.json outdated packages without broking the app (safely update npm packages)

- [ ] Implement Logger dashboard

- [ ] API Documentation using `swagger-jsdoc` or `swagger-ui-express`

- [ ] CI/CD Pipeline:

  - Set up a Continuous Integration / Continuous Deployment pipeline using GitHub Actions, GitLab CI, or Jenkins to automate testing and deployment processes.
  - Automate linting, testing, and deployments to your staging and production environments.

- [ ] Real-time Monitoring: Use monitoring tools like Prometheus and Grafana to track server health, database performance, and application metrics.

- [ ] Alerting: Set up alerts for critical failures, errors, or performance bottlenecks using tools like New Relic, Datadog, or Sentry.
- [ ] design patterns (e.g., Singleton, Factory, Observer, Strategy, Dependency Injection)
- [ ] SOLID Principles: Adherence to SOLID principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion) for writing maintainable, extensible, and decoupled code.
