import "./styles/SplashScreen.css";

function SplashScreen() {
  return (
    <div className="splash-container">

      <h1 className="app-name">
        IntellMeet
      </h1>

      <p className="tagline">
        AI-Powered Enterprise Meeting & Collaboration Platform
      </p>

      <div className="loader"></div>

    </div>
  );
}

export default SplashScreen;