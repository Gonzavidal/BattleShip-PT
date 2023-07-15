import React from 'react';
import Board from "./Board.jsx";
import Footer from "./Footer.jsx";

const Home = () => {
  return (
    <>
      <div className="position-absolute top-50 start-50 translate-middle text-center" id="set-game">
        <Board/>
      </div>

      <div className="footer-container">
        <Footer />
      </div>
    </>
  );
};

export default Home;
