import React from "react";

const HomeSection = () => {
  return (
    <div className="bg-dark text-white py-5">
      <div className="container">
        <h2 className="text-center mb-4">Browse talent by category</h2>
        <p className="text-center mb-5">
          Looking for work? <a href="#!" className="text-primary">Browse jobs</a>
        </p>

        <div className="row">
          {/* Категория 1: Development & IT */}
          <div className="col-md-3 mb-4">
            <div className="card bg-secondary text-white h-100">
              <div className="card-body">
                <h5 className="card-title">Development & IT</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <p className="text-warning">4.85/5</p>
              </div>
            </div>
          </div>

          {/* Категория 2: Design & Creative */}
          <div className="col-md-3 mb-4">
            <div className="card bg-secondary text-white h-100">
              <div className="card-body">
                <h5 className="card-title">Design & Creative</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <p className="text-warning">4.85/5</p>
              </div>
            </div>
          </div>

          {/* Категория 3: Sales & Marketing */}
          <div className="col-md-3 mb-4">
            <div className="card bg-secondary text-white h-100">
              <div className="card-body">
                <h5 className="card-title">Sales & Marketing</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <p className="text-warning">4.85/5</p>
              </div>
            </div>
          </div>

          {/* Категория 4: Finance & Accounting */}
          <div className="col-md-3 mb-4">
            <div className="card bg-secondary text-white h-100">
              <div className="card-body">
                <h5 className="card-title">Finance & Accounting</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <p className="text-warning">4.85/5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;