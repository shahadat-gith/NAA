import React from "react";
import { Helmet } from "react-helmet-async";

const DataPolicy = () => {
  return (
    <div className="legal-page">
      <Helmet>
        <title>
          Data Policy | Nashib Ali Academy
        </title>

        <meta
          name="description"
          content="Read the Data Policy of Nashib Ali Academy regarding data collection, storage, security, and processing practices."
        />
      </Helmet>

      <section className="legal-section">
        <div className="legal-container">

          {/* Header */}
          <header className="legal-header">
            <h1 className="legal-title">
              Data Policy
            </h1>

            <p className="legal-updated">
              Last Updated:{" "}
              {new Date().getFullYear()}
            </p>

            <p className="legal-intro">
              This Data Policy explains how
              Nashib Ali Academy collects,
              stores, processes, manages, and
              protects user and transaction
              data related to our educational
              services and digital platform.
            </p>
          </header>

          {/* Scope */}
          <article className="legal-block">
            <h2 className="legal-heading">
              1. Scope of This Policy
            </h2>

            <p className="legal-text">
              This policy applies to all data
              collected through our website,
              applications, educational
              services, payment systems,
              communication channels, and
              related digital platforms.
            </p>

            <p className="legal-text">
              It includes information related
              to students, users,
              transactions, technical logs,
              and communication records.
            </p>
          </article>

          {/* Data Collection */}
          <article className="legal-block">
            <h2 className="legal-heading">
              2. Types of Data Collected
            </h2>

            <p className="legal-text">
              We may collect and process the
              following categories of data:
            </p>

            <ul className="legal-list">
              <li className="legal-list-item">
                Personal identification
                information such as name,
                email address, and phone
                number.
              </li>

              <li className="legal-list-item">
                Educational and account-
                related information.
              </li>

              <li className="legal-list-item">
                Technical information such as
                IP address, browser details,
                device information, and usage
                logs.
              </li>

              <li className="legal-list-item">
                Payment transaction metadata
                and billing records.
              </li>

              <li className="legal-list-item">
                Customer support and
                communication records.
              </li>
            </ul>
          </article>

          {/* Data Storage */}
          <article className="legal-block">
            <h2 className="legal-heading">
              3. Data Storage & Security
            </h2>

            <p className="legal-text">
              We store data using reasonably
              secure systems and industry-
              standard security measures
              designed to protect against
              unauthorized access,
              disclosure, alteration, or
              destruction.
            </p>

            <p className="legal-text">
              Access to personal data is
              limited to authorized personnel
              and trusted service providers
              who require such access for
              operational purposes.
            </p>
          </article>

          {/* Payment Data */}
          <article className="legal-block">
            <h2 className="legal-heading">
              4. Payment Data Handling
            </h2>

            <p className="legal-text">
              We do not store raw debit card,
              credit card, CVV, or sensitive
              banking credentials on our
              servers.
            </p>

            <p className="legal-text">
              Payment processing is performed
              through authorized third-party
              payment gateways that comply
              with applicable security and
              PCI DSS standards.
            </p>
          </article>

          {/* Data Usage */}
          <article className="legal-block">
            <h2 className="legal-heading">
              5. Purpose of Data Usage
            </h2>

            <p className="legal-text">
              Collected data may be used for:
            </p>

            <ul className="legal-list">
              <li className="legal-list-item">
                Providing educational
                services and platform access.
              </li>

              <li className="legal-list-item">
                Payment verification and
                transaction processing.
              </li>

              <li className="legal-list-item">
                User authentication and
                account management.
              </li>

              <li className="legal-list-item">
                Analytics, performance
                monitoring, and service
                improvement.
              </li>

              <li className="legal-list-item">
                Legal compliance and fraud
                prevention.
              </li>
            </ul>
          </article>

          {/* Data Retention */}
          <article className="legal-block">
            <h2 className="legal-heading">
              6. Data Retention
            </h2>

            <p className="legal-text">
              Data may be retained for as
              long as reasonably necessary to
              fulfill operational, legal,
              accounting, security, and
              compliance requirements.
            </p>
          </article>

          {/* Third Parties */}
          <article className="legal-block">
            <h2 className="legal-heading">
              7. Third-Party Services
            </h2>

            <p className="legal-text">
              Certain operational functions
              may involve third-party service
              providers including hosting,
              analytics, communication, and
              payment processing platforms.
            </p>

            <p className="legal-text">
              Such providers are expected to
              maintain appropriate security
              and confidentiality standards.
            </p>
          </article>

          {/* International Transfers */}
          <article className="legal-block">
            <h2 className="legal-heading">
              8. International Data Transfers
            </h2>

            <p className="legal-text">
              If data is transferred or
              processed outside the user's
              country of residence,
              reasonable measures will be
              implemented to ensure
              appropriate protection
              consistent with applicable
              legal requirements.
            </p>
          </article>

          {/* User Rights */}
          <article className="legal-block">
            <h2 className="legal-heading">
              9. User Rights
            </h2>

            <p className="legal-text">
              Users may request access,
              correction, or deletion of
              personal information subject to
              applicable laws and operational
              requirements.
            </p>
          </article>

          {/* Updates */}
          <article className="legal-block">
            <h2 className="legal-heading">
              10. Policy Updates
            </h2>

            <p className="legal-text">
              We reserve the right to modify
              or update this Data Policy at
              any time. Updated versions will
              be published on this page with
              the revised effective date.
            </p>
          </article>

          {/* Contact */}
          <article className="legal-block legal-contact">
            <h2 className="legal-heading">
              11. Contact Information
            </h2>

            <p className="legal-text">
              For questions regarding this
              Data Policy or data handling
              practices, contact:
            </p>

            <div className="legal-contact-box">
              <p className="legal-contact-item">
                <strong>
                  Nashib Ali Academy
                </strong>
              </p>

              <p className="legal-contact-item">
                Email:
                nashibaliacademy.offl@gmail.com
              </p>
            </div>
          </article>

        </div>
      </section>
    </div>
  );
};

export default DataPolicy;