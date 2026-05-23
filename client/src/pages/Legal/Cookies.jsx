import React from "react";
import { Helmet } from "react-helmet-async";

const Cookies = () => {
  return (
    <div className="legal-page">
      <Helmet>
        <title>
          Cookies Policy | Nashib Ali Academy
        </title>

        <meta
          name="description"
          content="Read the Cookies Policy of Nashib Ali Academy to understand how cookies and similar technologies are used on our website."
        />
      </Helmet>

      <section className="legal-section">
        <div className="legal-container">

          {/* Header */}
          <header className="legal-header">
            <h1 className="legal-title">
              Cookies Policy
            </h1>

            <p className="legal-updated">
              Last Updated:{" "}
              {new Date().getFullYear()}
            </p>

            <p className="legal-intro">
              This Cookies Policy explains
              how Nashib Ali Academy uses
              cookies and similar tracking
              technologies when you access or
              interact with our website and
              services.
            </p>
          </header>

          {/* What are cookies */}
          <article className="legal-block">
            <h2 className="legal-heading">
              1. What Are Cookies?
            </h2>

            <p className="legal-text">
              Cookies are small text files
              stored on your device by a
              website. They help websites
              recognize users, remember
              preferences, improve
              functionality, and enhance the
              browsing experience.
            </p>
          </article>

          {/* Usage */}
          <article className="legal-block">
            <h2 className="legal-heading">
              2. How We Use Cookies
            </h2>

            <p className="legal-text">
              We may use cookies and similar
              technologies for operational,
              analytical, and user experience
              purposes.
            </p>

            <ul className="legal-list">
              <li className="legal-list-item">
                <strong>
                  Essential Cookies:
                </strong>{" "}
                Required for core website
                functionality including
                navigation, authentication,
                and security.
              </li>

              <li className="legal-list-item">
                <strong>
                  Performance Cookies:
                </strong>{" "}
                Help us understand how users
                interact with the platform so
                that we can improve website
                performance and usability.
              </li>

              <li className="legal-list-item">
                <strong>
                  Functional Cookies:
                </strong>{" "}
                Remember user settings,
                preferences, and previously
                selected options.
              </li>

              <li className="legal-list-item">
                <strong>
                  Analytics Cookies:
                </strong>{" "}
                Used to collect aggregated
                usage information for traffic
                analysis and service
                optimization.
              </li>
            </ul>
          </article>

          {/* Third Party */}
          <article className="legal-block">
            <h2 className="legal-heading">
              3. Third-Party Cookies
            </h2>

            <p className="legal-text">
              Some cookies may be placed by
              trusted third-party services
              including analytics providers,
              embedded content providers, or
              payment gateways integrated
              into our platform.
            </p>

            <p className="legal-text">
              We do not control the policies
              or practices of third-party
              cookie providers.
            </p>
          </article>

          {/* Managing */}
          <article className="legal-block">
            <h2 className="legal-heading">
              4. Managing Cookies
            </h2>

            <p className="legal-text">
              Users can manage or disable
              cookies through browser
              settings. Most browsers allow
              you to:
            </p>

            <ul className="legal-list">
              <li className="legal-list-item">
                View stored cookies.
              </li>

              <li className="legal-list-item">
                Delete existing cookies.
              </li>

              <li className="legal-list-item">
                Block future cookies.
              </li>

              <li className="legal-list-item">
                Configure cookie preferences
                for specific websites.
              </li>
            </ul>

            <p className="legal-text">
              Disabling certain cookies may
              affect website functionality
              and user experience.
            </p>
          </article>

          {/* Consent */}
          <article className="legal-block">
            <h2 className="legal-heading">
              5. Consent to Cookies
            </h2>

            <p className="legal-text">
              By continuing to use our
              website, you consent to the use
              of cookies and similar
              technologies as described in
              this policy, unless disabled
              through browser settings.
            </p>
          </article>

          {/* Security */}
          <article className="legal-block">
            <h2 className="legal-heading">
              6. Data & Security
            </h2>

            <p className="legal-text">
              Cookies used by our platform do
              not intentionally store highly
              sensitive personal information
              such as raw card details,
              passwords, or confidential
              financial credentials.
            </p>
          </article>

          {/* Updates */}
          <article className="legal-block">
            <h2 className="legal-heading">
              7. Policy Updates
            </h2>

            <p className="legal-text">
              We may update this Cookies
              Policy from time to time.
              Updated versions will be posted
              on this page with the revised
              effective date.
            </p>
          </article>

          {/* Contact */}
          <article className="legal-block legal-contact">
            <h2 className="legal-heading">
              8. Contact Information
            </h2>

            <p className="legal-text">
              For questions regarding this
              Cookies Policy, contact:
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

export default Cookies;