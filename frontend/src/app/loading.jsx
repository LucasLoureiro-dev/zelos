import "../components/loading/loading.css";

export default function Loading() {
  return (
    <>
      <div className="container d-flex justify-content-center align-items-center">
          <div className="gearbox">
            <div className="overlay" />
            <div className="gear one">
              <div className="gear-inner">
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
              </div>
            </div>
            <div className="gear two">
              <div className="gear-inner">
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
              </div>
            </div>
            <div className="gear three">
              <div className="gear-inner">
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
              </div>
            </div>
            <div className="gear four large">
              <div className="gear-inner">
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
              </div>
            </div>
          </div>
      </div>
    </>
  );
}
