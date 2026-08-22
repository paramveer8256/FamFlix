import { useState } from "react";
import { UserPlus } from "lucide-react";

export const FindFriends = () => {
  const [search, setSearch] = useState("");

  // Temporary users — backend will replace this later
  const users = [
    {
      id: 1,
      username: "Rahul",
      image: "https://i.pravatar.cc/150?img=12",
      mutualFriends: 4,
    },
    {
      id: 2,
      username: "Aman",
      image: "https://i.pravatar.cc/150?img=33",
      mutualFriends: 2,
    },
    {
      id: 3,
      username: "Diksha",
      image: "https://i.pravatar.cc/150?img=47",
      mutualFriends: 7,
    },
    {
      id: 4,
      username: "Arjun",
      image: "https://i.pravatar.cc/150?img=11",
      mutualFriends: 1,
    },
  ];

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Find Friends</h2>

      <p className="text-gray-400 mb-6">Search for people by their username.</p>

      {/* Search */}
      <div className="max-w-2xl relative mb-8">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search username..."
          className="w-full bg-[#181818] border border-gray-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-[#1E90FF] transition"
        />
      </div>

      {/* Search Results */}
      {search.trim() !== "" && (
        <div className="max-w-2xl space-y-3">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <SearchUserCard key={user.id} user={user} />
            ))
          ) : (
            <div className="py-12 text-center text-gray-500">
              No users found.
            </div>
          )}
        </div>
      )}

      {/* Initial state */}
      {search.trim() === "" && (
        <div className="border border-dashed border-gray-800 rounded-xl py-16 flex flex-col items-center text-center">
          <UserPlus size={38} className="text-gray-700 mb-4" />

          <h3 className="text-lg font-semibold mb-2">Find people you know</h3>

          <p className="text-gray-500 max-w-sm">
            Search for a username to find people and send them a friend request.
          </p>
        </div>
      )}
    </div>
  );
};
const SearchUserCard = ({ user }) => {
  return (
    <div className="bg-[#141414] border border-gray-800 rounded-xl p-4 flex items-center gap-4 hover:border-gray-600 transition">
      <img
        src={user.image}
        alt={user.username}
        className="w-14 h-14 rounded-full object-cover"
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{user.username}</h3>

        <p className="text-sm text-gray-500">
          {user.mutualFriends} mutual friends
        </p>
      </div>

      <button className="flex items-center gap-2 bg-[#1E90FF] hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition">
        <UserPlus size={17} />
        <span className="hidden sm:inline">Add Friend</span>
      </button>
    </div>
  );
};
