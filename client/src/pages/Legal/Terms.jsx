import React from "react";
import { Helmet } from "react-helmet-async";

const Terms = () => {
  return (
    <div className="legal-page">
      <Helmet>
        <title>
          Terms & Conditions | Nashib Ali
          Academy
        </title>

        <meta
          name="description"
          content="Read the Terms and Conditions for using Nashib Ali Academy services, courses, and website."
        />
      </Helmet>

      <section className="legal-section">
        <div className="legal-container">

          {/* Header */}
          <header className="legal-header">
            <h1 className="legal-title">
              Terms & Conditions
            </h1>

            <p className="legal-updated">
              Last Updated:{" "}
              {new Date().getFullYear()}
            </p>

            <p className="legal-intro">
              These Terms & Conditions govern
              your access to and use of the
              website, digital services,
              educational content, and
              related platforms operated by
              Nashib Ali Academy.
            </p>
          </header>

          {/* Acceptance */}
          <article className="legal-block">
            <h2 className="legal-heading">
              1. Acceptance of Terms
            </h2>

            <p className="legal-text">
              By accessing, browsing, or
              using our website and services,
              you agree to comply with these
              Terms & Conditions. If you do
              not agree with any part of
              these terms, you should not use
              our services.
            </p>
          </article>

          {/* Services */}
          <article className="legal-block">
            <h2 className="legal-heading">
              2. Services Provided
            </h2>

            <p className="legal-text">
              Nashib Ali Academy provides
              educational content, online
              courses, mentorship,
              informational resources, and
              related digital services.
              Services may be updated,
              modified, suspended, or
              discontinued at any time
              without prior notice.
            </p>
          </article>

          {/* Eligibility */}
          <article className="legal-block">
            <h2 className="legal-heading">
              3. User Eligibility
            </h2>

            <p className="legal-text">
              By using this platform, you
              confirm that:
            </p>

            <ul className="legal-list">
              <li className="legal-list-item">
                You are legally capable of
                entering into binding
                agreements under applicable
                laws.
              </li>

              <li className="legal-list-item">
                The information provided by
                you is accurate and complete.
              </li>

              <li className="legal-list-item">
                You will use the platform
                only for lawful purposes.
              </li>
            </ul>
          </article>

          {/* Accounts */}
          <article className="legal-block">
            <h2 className="legal-heading">
              4. User Accounts
            </h2>

            <p className="legal-text">
              Certain services may require
              account registration. Users are
              responsible for maintaining the
              confidentiality of account
              credentials and for all
              activities conducted under
              their account.
            </p>

            <p className="legal-text">
              We reserve the right to suspend
              or terminate accounts that
              violate these Terms or involve
              suspicious activity.
            </p>
          </article>

          {/* Payments */}
          <article className="legal-block">
            <h2 className="legal-heading">
              5. Payments & Billing
            </h2>

            <p className="legal-text">
              Payments made on this platform
              are securely processed through
              authorized third-party payment
              gateways.
            </p>

            <ul className="legal-list">
              <li className="legal-list-item">
                Users agree to provide valid
                payment information.
              </li>

              <li className="legal-list-item">
                Prices and service charges
                may change without prior
                notice.
              </li>

              <li className="legal-list-item">
                Refunds are governed by our
                separate Refund & Cancellation
                Policy.
              </li>
            </ul>
          </article>

          {/* Intellectual Property */}
          <article className="legal-block">
            <h2 className="legal-heading">
              6. Intellectual Property Rights
            </h2>

            <p className="legal-text">
              All website content including
              text, graphics, branding,
              videos, course materials,
              logos, and designs are owned or
              licensed by Nashib Ali Academy
              and are protected under
              applicable intellectual
              property laws.
            </p>

            <p className="legal-text">
              Users may not copy, reproduce,
              distribute, modify, or exploit
              any content without prior
              written permission.
            </p>
          </article>

          {/* Prohibited Uses */}
          <article className="legal-block">
            <h2 className="legal-heading">
              7. Prohibited Activities
            </h2>

            <p className="legal-text">
              Users agree not to:
            </p>

            <ul className="legal-list">
              <li className="legal-list-item">
                Use the platform for unlawful
                purposes.
              </li>

              <li className="legal-list-item">
                Attempt unauthorized access
                to systems or accounts.
              </li>

              <li className="legal-list-item">
                Distribute harmful software,
                spam, or malicious content.
              </li>

              <li className="legal-list-item">
                Share or resell purchased
                course materials without
                authorization.
              </li>
            </ul>
          </article>

          {/* Disclaimer */}
          <article className="legal-block">
            <h2 className="legal-heading">
              8. Disclaimer
            </h2>

            <p className="legal-text">
              Services and educational
              content are provided on an "as
              available" and "as is" basis.
              While we strive for accuracy
              and quality, we do not
              guarantee uninterrupted
              availability, specific results,
              or error-free operation.
            </p>
          </article>

          {/* Liability */}
          <article className="legal-block">
            <h2 className="legal-heading">
              9. Limitation of Liability
            </h2>

            <p className="legal-text">
              To the maximum extent permitted
              by law, Nashib Ali Academy
              shall not be liable for any
              indirect, incidental,
              consequential, special, or
              punitive damages arising from
              the use of the website or
              services.
            </p>
          </article>

          {/* Governing Law */}
          <article className="legal-block">
            <h2 className="legal-heading">
              10. Governing Law & Jurisdiction
            </h2>

            <p className="legal-text">
              These Terms & Conditions are
              governed by the laws of India.
              Any disputes arising from the
              use of this platform shall be
              subject to the jurisdiction of
              competent courts located in
              Assam, India.
            </p>
          </article>

          {/* Updates */}
          <article className="legal-block">
            <h2 className="legal-heading">
              11. Changes to Terms
            </h2>

            <p className="legal-text">
              We reserve the right to modify
              these Terms & Conditions at any
              time. Updated versions will be
              published on this page with the
              revised effective date.
            </p>
          </article>

          {/* Contact */}
          <article className="legal-block legal-contact">
            <h2 className="legal-heading">
              12. Contact Information
            </h2>

            <p className="legal-text">
              For questions regarding these
              Terms & Conditions, contact:
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

export default Terms;