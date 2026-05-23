import React from "react";
import { Helmet } from "react-helmet-async";

const RefundPolicy = () => {
  return (
    <div className="legal-page">
      <Helmet>
        <title>
          Refund Policy | Nashib Ali Academy
        </title>

        <meta
          name="description"
          content="Read the Refund and Cancellation Policy of Nashib Ali Academy."
        />
      </Helmet>

      <section className="legal-section">
        <div className="legal-container">

          {/* Header */}
          <header className="legal-header">
            <h1 className="legal-title">
              Refund & Cancellation Policy
            </h1>

            <p className="legal-updated">
              Effective Date:{" "}
              {new Date().getFullYear()}
            </p>

            <p className="legal-intro">
              This Refund and Cancellation
              Policy explains the terms under
              which refunds, cancellations,
              and payment disputes are
              handled for services and
              digital products offered by
              Nashib Ali Academy.
            </p>
          </header>

          {/* Overview */}
          <article className="legal-block">
            <h2 className="legal-heading">
              1. Overview
            </h2>

            <p className="legal-text">
              Nashib Ali Academy provides
              educational content, courses,
              mentorship, and digital
              learning services. By making a
              purchase on our platform, you
              acknowledge and agree to this
              Refund and Cancellation Policy.
            </p>
          </article>

          {/* Eligibility */}
          <article className="legal-block">
            <h2 className="legal-heading">
              2. Refund Eligibility
            </h2>

            <p className="legal-text">
              Refund requests may be
              considered under the following
              circumstances:
            </p>

            <ul className="legal-list">
              <li className="legal-list-item">
                Duplicate payment made for
                the same service or course.
              </li>

              <li className="legal-list-item">
                Failed transaction where the
                payment was deducted but the
                service was not activated.
              </li>

              <li className="legal-list-item">
                Technical issues caused by
                our platform preventing
                access to purchased content.
              </li>

              <li className="legal-list-item">
                Services not delivered as
                reasonably described.
              </li>
            </ul>
          </article>

          {/* Non Refundable */}
          <article className="legal-block">
            <h2 className="legal-heading">
              3. Non-Refundable Situations
            </h2>

            <p className="legal-text">
              Refunds generally will not be
              provided in the following
              situations:
            </p>

            <ul className="legal-list">
              <li className="legal-list-item">
                Change of mind after
                purchasing a course or
                service.
              </li>

              <li className="legal-list-item">
                Failure to complete or attend
                a course after gaining
                access.
              </li>

              <li className="legal-list-item">
                Dissatisfaction based on
                personal expectations not
                explicitly promised by the
                platform.
              </li>

              <li className="legal-list-item">
                Delay caused by the user's
                device, internet connection,
                or third-party services.
              </li>
            </ul>
          </article>

          {/* Cancellation */}
          <article className="legal-block">
            <h2 className="legal-heading">
              4. Cancellation Policy
            </h2>

            <p className="legal-text">
              Users may cancel subscription-
              based services before the next
              billing cycle where applicable.
              Cancellation requests do not
              guarantee automatic refunds for
              previously processed payments.
            </p>
          </article>

          {/* Refund Process */}
          <article className="legal-block">
            <h2 className="legal-heading">
              5. Refund Request Process
            </h2>

            <p className="legal-text">
              To request a refund, users must
              contact our support team with:
            </p>

            <ul className="legal-list">
              <li className="legal-list-item">
                Full name
              </li>

              <li className="legal-list-item">
                Registered email address
              </li>

              <li className="legal-list-item">
                Transaction/payment details
              </li>

              <li className="legal-list-item">
                Reason for refund request
              </li>
            </ul>

            <p className="legal-text">
              Refund requests should be sent
              to:
            </p>

            <div className="legal-contact-box">
              <p className="legal-contact-item">
                Email:
                nashibaliacademy.offl@gmail.com
              </p>
            </div>
          </article>

          {/* Processing Time */}
          <article className="legal-block">
            <h2 className="legal-heading">
              6. Refund Processing Time
            </h2>

            <p className="legal-text">
              Approved refunds are generally
              processed within 7–10 business
              days. The actual time required
              for the amount to reflect in
              the user's account may vary
              depending on banks, card
              issuers, or payment gateways.
            </p>
          </article>

          {/* Payment Gateway */}
          <article className="legal-block">
            <h2 className="legal-heading">
              7. Payment Gateway & Third-
              Party Processing
            </h2>

            <p className="legal-text">
              Payments processed through
              third-party payment gateways
              are subject to the terms and
              processing timelines of those
              providers. Nashib Ali Academy
              is not responsible for delays
              caused by banking systems or
              payment processors.
            </p>
          </article>

          {/* Fraud */}
          <article className="legal-block">
            <h2 className="legal-heading">
              8. Fraudulent or Abusive Claims
            </h2>

            <p className="legal-text">
              We reserve the right to refuse
              refund requests in cases of
              suspected abuse, fraudulent
              activity, chargeback misuse, or
              policy violations.
            </p>
          </article>

          {/* Policy Updates */}
          <article className="legal-block">
            <h2 className="legal-heading">
              9. Policy Updates
            </h2>

            <p className="legal-text">
              This policy may be modified or
              updated at any time without
              prior notice. Updated versions
              will be published on this page.
            </p>
          </article>

          {/* Contact */}
          <article className="legal-block legal-contact">
            <h2 className="legal-heading">
              10. Contact Information
            </h2>

            <p className="legal-text">
              For refund or cancellation
              related questions, contact:
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

export default RefundPolicy;