// import React, { useState, useEffect } from "react";
// import { Connector, subscribe } from "react-mqtt-client";

// export default function Example() {
//   const [message, setMessage] = useState("");
//   // Declare a new state variable, which we'll call "count"

//   useEffect(() => {
//     console.log("hello");
//   });

//   const sendMessage = (event) => {
//     event.preventDefault();
//     console.log(message);
//   };

//   const onChange = ({ target: { value } }) => {
//     setMessage(value);
//   };

//   return (
//     <div>
//       <form className="form">
//         <input
//           className="input"
//           type="number"
//           placeholder="Type a message..."
//           value={message}
//           onChange={onChange}
//           onKeyPress={(event) => (event.key === "Enter" ? sendMessage(event) : null)}
//         />
//         <button className="sendButton" onClick={(e) => sendMessage(e)}>
//           Send
//         </button>
//       </form>
//     </div>
//   );
// }

import React, { Component } from "react";

export default class Mqtt extends Component {
  constructor() {
    super();
    this.state = {
      message: "",
    };
  }
  componentDidMount() {
    console.log("hi");
  }

  sendMessage = (event) => {
    event.preventDefault();
    console.log(this.state.message);
  };

  onChange = (event) => {
    this.setState({
      message: event.target.value,
    });
  };

  render() {
    return (
      <div>
        <form className="form">
          <input
            className="input"
            type="number"
            placeholder="Type a message..."
            value={this.state.message}
            onChange={this.onChange}
          />
          <button className="sendButton" onClick={this.sendMessage}>
            Send
          </button>
        </form>
      </div>
    );
  }
}
