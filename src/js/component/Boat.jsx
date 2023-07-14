import { useEffect, useState } from "react";

function Board(props) {
  const [color, setColor] = useState("");

  useEffect(() => {
    function changeColor() {
      setColor(
        props.boxValue === 1 && props.type !== "CPU" ? "black" :
          props.boxValue === 2 ? "red" :
            props.boxValue === 3 ? "dark-gray" : ""
      );
    }
    changeColor();
  }, [props.boxValue, props.type]);

  return (
    <div onClick={() => { props.onClickBox() }} className={"box " + color}>
    </div>
  )
}

export default Board;