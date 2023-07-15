import React from 'react';
import Board from "./Board.jsx";




//create your first component
const Home = () => {
	return (
		<>
			
			<div className="position-absolute top-50 start-50 translate-middle text-center" id="set-game">
				<Board/>
				
				
			</div>
		</>
	)
};

export default Home;
