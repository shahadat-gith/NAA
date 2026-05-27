import { Link, useSearchParams } from 'react-router-dom';
import { curriculumDetailsData } from './curriculumData';
import './CurriculumDetails.css';
import Banner from '../../components/Banner/Banner';
import { curriculumImages } from './assets/images';
import { Helmet } from 'react-helmet-async';

const CurriculumDetails = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'kinder';

  const details = curriculumDetailsData[type];

  // Map type to image; use 'higher' for 'higher-secondary'
  const imageKey = type === 'higher-secondary' ? 'higher' : type;
  const bannerImage = curriculumImages[imageKey];

  // Get all curriculum types for tabs
  const curriculumTypes = Object.keys(curriculumDetailsData);

  return (
    <>
      <Helmet>
        <title>Curriculum | Nashib Ali Academy</title>
        <meta
          name="description"
          content="Explore the academic curriculum of Nashib Ali Academy, designed to support holistic learning and academic excellence for students in Barpeta, Assam."
        />
      </Helmet>
      
      <Banner image={bannerImage} />
      
      <section className="crd-details-section">
        {details ? (
          <>
            {/* Navigation Tabs */}
            <div className="crd-tabs-nav">
              {curriculumTypes.map((curriculumType) => (
                <Link
                  key={curriculumType}
                  to={`/curriculum?type=${curriculumType}`}
                  className={`crd-tab-item ${type === curriculumType ? 'crd-active' : ''}`}
                >
                  {curriculumDetailsData[curriculumType].title.split(' ')[0]}
                </Link>
              ))}
            </div>

            {/* Content Container */}
            <div className="crd-details-container">
              
              {/* Overview Section */}
              <div className="crd-card crd-overview-card">
                <h3 className="crd-card-title">
                  <i className="fas fa-book-open"></i> Overview
                </h3>
                <p className="crd-card-text">{details.overview}</p>
              </div>

              {/* Subjects Section */}
              <div className="crd-card">
                <h3 className="crd-card-title">
                  <i className="fas fa-book"></i> Core Subjects
                </h3>
                <div className="crd-subjects-list">
                  {details.subjects.map((subject, index) => (
                    <div key={index} className="crd-subject-item">
                      <div className="crd-subject-icon">
                        <i className={`fas fa-${subject.icon}`}></i>
                      </div>
                      <div className="crd-subject-content">
                        <h4>{subject.name}</h4>
                        <p>{subject.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teaching Methods Section */}
              <div className="crd-card">
                <h3 className="crd-card-title">
                  <i className="fas fa-chalkboard-teacher"></i> Teaching Methodologies
                </h3>
                <div className="crd-methods-list">
                  {details.methods.map((method, index) => (
                    <div key={index} className="crd-method-item">
                      <div className="crd-method-icon">
                        <i className={`fas fa-${method.icon}`}></i>
                      </div>
                      <div className="crd-method-content">
                        <h4>{method.name}</h4>
                        <p>{method.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Program Features Section */}
              <div className="crd-card">
                <h3 className="crd-card-title">
                  <i className="fas fa-star"></i> Key Program Features
                </h3>
                <div className="crd-features-grid">
                  {details.features.map((feature, index) => (
                    <div key={index} className="crd-feature-pill">
                      <i className={`fas fa-${feature.icon}`}></i>
                      <span>{feature.name}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        ) : (
          /* Error Layout State */
          <div className="crd-error-fallback">
            <div className="crd-error-icon">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <h2>Curriculum Not Found</h2>
            <p className="crd-error-msg" aria-live="polite">
              We couldn't find the requested curriculum data module. Please choose an alternate academic track.
            </p>
            <Link to="/curriculum" className="crd-return-btn">
              <i className="fas fa-arrow-left"></i> Return to Main Directory
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default CurriculumDetails;