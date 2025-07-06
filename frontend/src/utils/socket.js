// // src/utils/socket.js
// import { io } from "socket.io-client";
// import { useAuthUserStore } from "../store/authUser.js";

// const socket = io("http://localhost:5000", {
//   query: {
//     userId: useAuthUserStore.getState().user
//       ? useAuthUserStore.getState().user._id
//       : null,
//   },
//   transports: ["websocket"],
// });

// export default socket;
