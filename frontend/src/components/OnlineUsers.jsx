// // OnlineUsers.jsx
// import { useAuthUserStore } from "../store/authUser";

// const OnlineUsers = () => {
//   const { onlineUsers } = useAuthUserStore();

//   return (
//     <div className="text-white p-4 bg-gray-900 rounded">
//       <h2 className="text-lg font-bold mb-2">
//         Online Users
//       </h2>
//       <ul className="list-disc pl-4">
//         {users.map((user) => (
//           <div key={user._id} className="relative">
//             <img
//               src={user.avatar}
//               className="w-10 h-10 rounded-full"
//             />
//             {onlineUsers.has(user._id) && (
//               <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
//             )}
//           </div>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default OnlineUsers;
